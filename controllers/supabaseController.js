const path = require("node:path");
const fs = require("fs");
const supabase = require("../supabase-client");

async function uploadFileToSupabase(file, folderId) {
  const fileBuffer = fs.readFileSync(file.path);
  const ext = path.extname(file.originalname);
  const uniqueFilename = `${Date.now()}-${file.originalname}`;
  const supabasePath = `${folderId}/${uniqueFilename}`;

  const { data, error } = await supabase.storage
    .from("user-storage")
    .upload(supabasePath, fileBuffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("user-storage")
    .getPublicUrl(supabasePath);

  return publicUrlData.publicUrl;
}

module.exports = { uploadFileToSupabase };
