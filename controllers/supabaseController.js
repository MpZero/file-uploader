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

async function deleteFilesFromSupabase(folderId) {
  const files = await readAllFiles(folderId);
  console.log(`deleteFilesFromSupabase`, files);

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

// module.exports = { uploadFileToSupabase };
module.exports = { uploadFileToSupabase, deleteFilesFromSupabase };
