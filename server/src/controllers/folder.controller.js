import Folder from "../models/folder.model.js";
import Document from "../models/document.model.js";

//@description     Create a new folder (root-level, or nested under a parent)
//@route           POST /api/folders
//@access          Protected
export const createFolder = async (req, res) => {
  const { folderName, parent } = req.body;

  try {
    if (!folderName) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    // if a parent is given, make sure it actually exists and belongs to this user
    if (parent) {
      const parentFolder = await Folder.findOne({ _id: parent, owner: req.user._id });
      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
    }

    const folder = await Folder.create({
      folderName,
      parent: parent || null,
      owner: req.user._id,
    });

    return res.status(201).json(folder);
  } catch (error) {
    // duplicate name in the same parent will trip the unique index
    if (error.code === 11000) {
      return res.status(400).json({ message: "A folder with this name already exists here" });
    }
    console.log("Error in createFolder controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     List folders - defaults to root-level, or pass ?parent=<id> for a subfolder's contents
//@route           GET /api/folders?parent=<id>
//@access          Protected
export const getFolders = async (req, res) => {
  const { parent } = req.query;

  try {
    const folders = await Folder.find({
      // owner: req.user._id,
      parent: parent || null,
    }).sort({ folderName: 1 });

    return res.status(200).json(folders);
  } catch (error) {
    console.log("Error in getFolders controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Get a single folder plus its immediate subfolders and documents
//@route           GET /api/folders/:id
//@access          Protected
export const getFolderContents = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await Folder.findOne({ _id: id, owner: req.user._id });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const [subfolders, documents] = await Promise.all([
      Folder.find({ parent: id, owner: req.user._id }).sort({ folderName: 1 }),  // get subfolders
      Document.find({ folder: id, uploadedBy: req.user._id }).sort({ createdAt: -1 }), // get documents
    ]);

    return res.status(200).json({ folder, subfolders, documents });
  } catch (error) {
    console.log("Error in getFolderContents controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Rename a folder
//@route           PATCH /api/folders/:id
//@access          Protected
export const renameFolder = async (req, res) => {
  const { id } = req.params;
  const { folderName } = req.body;

  try {
    if (!folderName) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const folder = await Folder.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { folderName },
      { returnDocument: "after" }
    );

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(folder);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A folder with this name already exists here" });
    }
    console.log("Error in renameFolder controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Delete a folder (blocked if it still has subfolders or documents in it)
//@route           DELETE /api/folders/:id
//@access          Protected
export const deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await Folder.findOne({ _id: id, owner: req.user._id });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const [subfolderCount, documentCount] = await Promise.all([
      Folder.countDocuments({ parent: id }),
      Document.countDocuments({ folder: id }),
    ]);

    if (subfolderCount > 0 || documentCount > 0) {
      return res.status(400).json({
        message: "Folder is not empty. Move or delete its contents first.",
      });
    }

    await folder.deleteOne();

    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.log("Error in deleteFolder controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}