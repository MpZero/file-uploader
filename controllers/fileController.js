const {
  updateFile,
  readFile,
  createFileDB,
} = require("../queries/fileQueries");
const { uploadFileToSupabase } = require("./supabaseController");

async function getUpdateFile(req, res) {
  const fileId = req.params.id;
  const file = await readFile(parseInt(fileId));
  // console.log(file);

  try {
    res.render("fileUpdate", {
      title: file.filename,
      file: file,
      errors: [{ msg: req.flash("error") }],
    });
  } catch (err) {
    console.error("Error updating file", err);
    req.flash("error", "Unable to update file");
    res.redirect(`/folders/${file.folderId}`);
  }
}

async function postUpdateFile(req, res) {
  const fileId = req.params.id;
  const newName = req.body.newName;
  const file = await readFile(parseInt(fileId));
  const folderId = file.folderId;

  try {
    await updateFile(parseInt(fileId), newName);
    res.redirect(`/folders/${folderId}/file/${fileId}/update`);
  } catch (err) {
    console.error("Error updating file", err);
    req.flash("error", "File name already exists");
    res.redirect(`/folders/${folderId}/file/${fileId}/update`);
  }
}

async function getFileDelete(req, res) {
  try {
    const folderId = req.params.folderId;
    const fileId = req.params.id;
    // await deleteFileFr(parseInt(fileId));
    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    console.error("Error deleting file", err);
    req.flash("error", "File already deleted or File doesn't exist");
    res.redirect(`/folders/${folderId}`);
  }
}

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
  console.log("REQ.FILE >>>", req.file);

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

module.exports = {
  getUpdateFile,
  postUpdateFile,
  getFileDelete,
  getUpload,
  postUpload,
};
