const supabase = require("../supabase-client");
const { readAllFiles } = require("../queries/fileQueries");

async function uploadFileToSupabase(file, folderId) {
  const uniqueFilename = `${Date.now()}${file.originalname}`;
  const supabasePath = `${folderId}/${uniqueFilename}`;

  const buffer = Buffer.from(file.buffer);

  const { data, error } = await supabase.storage
    .from("user-storage")
    .upload(supabasePath, buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("user-storage")
    .getPublicUrl(supabasePath);

  return {
    publicUrl: publicUrlData.publicUrl,
    filename: uniqueFilename,
  };
}

async function removeFolderSupabase(folderId) {
  const files = await readAllFiles(folderId);

  if (!files || files.length === 0) {
    console.error("This folder has no files.");
    return;
  }

  const filePaths = files.map((file) => `${file.folderId}/${file.filename}`);

  const { error } = await supabase.storage
    .from("user-storage")
    .remove(filePaths);

  if (error) {
    console.error("Error deleting storage files:", error);
    throw error;
  }
}

async function updateFileSupabase(oldPath, filename, newPath) {
  //copy old file, rename
  const { error: copyError } = await supabase.storage
    .from("user-storage")
    .copy(oldPath, newPath);

  if (copyError) throw copyError;

  //delete old file
  const { error: deleteError } = await supabase.storage
    .from("user-storage")
    .remove([oldPath]);

  if (deleteError) throw deleteError;

  const { data } = supabase.storage.from("user-storage").getPublicUrl(newPath);

  return {
    publicUrl: data.publicUrl,
  };
}

async function removeFileSupabase(path) {
  const { error } = await supabase.storage.from("user-storage").remove([path]);

  if (error) {
    console.error("Error deleting storage file:", error);
    throw error;
  }
}

async function downloadFile(path) {
  const { data, error } = await supabase.storage
    .from("user-storage")
    .download(path);

  if (error) {
    console.error("Supabase .download() error:", error);
    return { error };
  }

  return { data };
}

module.exports = {
  uploadFileToSupabase,
  removeFolderSupabase,
  updateFileSupabase,
  removeFileSupabase,
  downloadFile,
};
