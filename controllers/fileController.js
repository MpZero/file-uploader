const {
  updateFile,
  readFile,
  createFileDB,
  removeFileDB,
} = require("../queries/fileQueries");
const {
  uploadFileToSupabase,
  updateFileSupabase,
  removeFileSupabase,
  downloadFile,
} = require("./supabaseController");

const { Readable } = require("stream");

/////////////////////////////////////////////////
/*-------------- UPLOAD LOGIC ---------------- */
/////////////////////////////////////////////////

async function getUpload(req, res) {
  const id = parseInt(req.params.id);
  res.render("upload", {
    title: "Upload a File",
    folderId: id,
    errors: [{ msg: req.flash("error") }],
  });
}

async function postUpload(req, res) {
  const folderId = parseInt(req.params.id);
  try {
    const { publicUrl, filename } = await uploadFileToSupabase(
      req.file,
      folderId
    );

    await createFileDB(folderId, filename, publicUrl, req.file.size);
    res.redirect(`/folders/${folderId}/`);
  } catch (err) {
    console.error("Error creating file", err);
    req.flash("error", "File already exists");
    res.redirect(`/folders/${folderId}/upload`);
  }
}

/////////////////////////////////////////////////
/*-------------- UPLOAD LOGIC ---------------- */
/////////////////////////////////////////////////

async function getUpdateFile(req, res) {
  const fileId = req.params.id;
  const file = await readFile(parseInt(fileId));

  res.render("fileUpdate", {
    title: file.filename,
    file: file,
    errors: [{ msg: req.flash("error") }],
    // success: [{ msg: req.flash("success") }],
  });
}

async function postUpdateFile(req, res) {
  const fileId = req.params.id;
  const file = await readFile(parseInt(fileId));
  const folderId = file.folderId;
  const newName = req.body.newName;
  const oldName = file.filename;
  const oldPath = `${folderId}/${oldName}`;
  const newPath = `${folderId}/${newName}`;

  try {
    const { publicUrl } = await updateFileSupabase(
      oldPath,
      file.filename,
      newPath
    );

    await updateFile(parseInt(fileId), newName, publicUrl);
    res.redirect(`/folders/${folderId}/file/${fileId}/update`);
  } catch (err) {
    console.error("Error updating file", err);
    req.flash("error", "File name already exists");
    res.redirect(`/folders/${folderId}/file/${fileId}/update`);
  }
}

async function getFileDelete(req, res) {
  const fileId = parseInt(req.params.id);
  const file = await readFile(fileId);
  const folderId = req.params.folderId;
  const filename = file.filename;
  const path = `${folderId}/${filename}`;
  try {
    await removeFileSupabase(path);
    await removeFileDB(fileId);
    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    console.error("Error deleting file", err);
    req.flash("error", "File already deleted or File doesn't exist");
    res.redirect(`/folders/${folderId}`);
  }
}

async function getFileDownload(req, res) {
  const fileId = parseInt(req.params.id);
  const folderId = req.params.folderId;

  try {
    const file = await readFile(fileId);
    if (!file) {
      req.flash("error", "File not found");
      return res.redirect(`/folders/${folderId}`);
    }

    const supabasePath = `${folderId}/${file.filename}`;
    const { data: blob, error } = await downloadFile(supabasePath);

    if (error) {
      console.error("Error downloading file:", error);
      req.flash("error", "Error downloading the file");
      return res.redirect(`/folders/${folderId}`);
    }

    //make the blob readable
    const stream = Readable.fromWeb(blob.stream());

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    );
    res.setHeader("Content-Type", file.mimetype || "application/octet-stream");

    //send to the client
    stream.pipe(res);
  } catch (err) {
    console.error("Error inside getFileDownload:", err);
    req.flash("error", "Couldn't download the file");
    res.redirect(`/folders/${folderId}`);
  }
}

module.exports = {
  getUpload,
  postUpload,
  getUpdateFile,
  postUpdateFile,
  getFileDownload,
  getFileDelete,
};
