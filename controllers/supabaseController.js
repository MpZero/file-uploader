const fs = require("fs");
const supabase = require("../supabase-client");
const { readAllFiles } = require("../queries/fileQueries");

async function uploadFileToSupabase(file, folderId) {
  const fileBuffer = fs.readFileSync(file.path);

  const uniqueFilename = `${Date.now()}-${file.originalname}`;
  const supabasePath = `${folderId}/${uniqueFilename}`;

  const { data, error } = await supabase.storage
    .from("user-storage")
    .upload(supabasePath, fileBuffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("user-storage")
    .getPublicUrl(supabasePath);

  return {
    publicUrl: publicUrlData.publicUrl,
    filename: uniqueFilename,
    path: supabasePath,
  };
}

// ----------------------------------------------

async function removeFilesFromSupabase(folderId) {
  const files = await readAllFiles(folderId);
  console.log(`removeFilesFromSupabase`, files);

  if (!files || files.length === 0) {
    console.log("This folder has no files.");
    return;
  }

  const filePaths = files.map((file) => `${file.folderId}/${file.filename}`);

  console.log(`user-storage/`, filePaths);

  const { error } = await supabase.storage
    .from("user-storage")
    .remove(filePaths);

  if (error) {
    console.error("Error deleting storage files:", error);
    throw error;
  }

  console.log("Files deleted:", filePaths);
}

async function updateFileSupabase(oldPath, filename, newPath) {
  console.log(`oldpath`, oldPath);
  console.log(`filename`, filename);
  console.log(`new path`, newPath);

  //copy old file with new name
  const { error: copyError } = await supabase.storage
    .from("user-storage")
    .copy(oldPath, newPath);

  if (copyError) throw copyError;

  //delete old file
  const { error: deleteError } = await supabase.storage
    .from("user-storage")
    .remove([oldPath]);

  if (deleteError) throw deleteError;

  //get new url
  const { data } = supabase.storage.from("user-storage").getPublicUrl(newPath);
  console.log(`data`, data);

  return {
    publicUrl: data.publicUrl,
  };
}

// module.exports = { uploadFileToSupabase };
module.exports = {
  uploadFileToSupabase,
  removeFilesFromSupabase,
  updateFileSupabase,
};
