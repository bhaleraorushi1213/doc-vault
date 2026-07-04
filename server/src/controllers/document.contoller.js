import fs from "fs";
import path from "path";
import Document from "../models/document.model.js";
import Folder from "../models/folder.model.js";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// a document is visible to: its uploader, or anyone who can approve documents
// (Admin/Manager). "document:read" is intentionally NOT used here - every role
// has that permission, so checking it would make every document visible to
// every employee regardless of who uploaded it. Once Share records exist,
// add a third check here: an active Share document naming this user.
const canAccessDocument = (document, user) => {
  const isOwner = document.uploadedBy?.toString() === user._id.toString();
  const isApprover = (user?.role?.permissions || []).includes("document:approve");
  return isOwner || isApprover;
};

//@description     Upload a new document, optionally into a folder
//@route           POST /api/documents
//@access          Protected - requires "document:upload" permission
export const uploadDocument = async (req, res) => {
  const { folder } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded" });
    }

    if (folder) {                                     // if a folder was specified, make sure it exists and belongs to this user
      const folderExists = await Folder.findOne({
        _id: folder,
        owner: req.user._id
      });
      if (!folderExists) {
        fs.unlink(req.file.path, () => {});          // clean up the file multer already wrote to disk since we're rejecting this request
        return res.status(404).json({ message: "Folder not found" });
      }
    }

    const document = await Document.create({
      fileName: req.file.originalname,
      // store a relative identifier (filename) instead of absolute filesystem path
      fileUrl: req.file.filename,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      folder: folder || null,
      uploadedBy: req.user._id,
    });

    return res.status(201).json(document);
  } catch (error) {
    console.log("Error in uploadDocument controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     List documents - defaults to root-level (no folder), or pass ?folder=<id>
//@route           GET /api/documents?folder=<id>
//@access          Protected - requires "document:read" permission
export const getDocuments = async (req, res) => {
  const { folder } = req.query;

  try {
    const documents = await Document.find({
      uploadedBy: req.user._id,
      folder: folder || null,
    }).sort({ createdAt: -1 });

    return res.status(200).json(documents);
  } catch (error) {
    console.log("Error in getDocuments controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Get a single document's metadata
//@route           GET /api/documents/:id
//@access          Protected - requires "document:read" permission
export const getDocumentById = async (req, res) => {
  const { id } = req.params;

  try {
    // fetch by id and then enforce access rules so managers/admins can view others' documents
    const document = await Document.findById(id);

    if (!document || !canAccessDocument(document, req.user)) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json(document);
  } catch (error) {
    console.log("Error in getDocumentById controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Download the actual file
//@route           GET /api/documents/:id/download
//@access          Protected - requires "document:read" permission
export const downloadDocument = async (req, res) => {
  const { id } = req.params;

  try {
    // fetch by id and enforce access rules similar to getDocumentById/updateApprovalStatus
    const document = await Document.findById(id);

    if (!document || !canAccessDocument(document, req.user)) {
      return res.status(404).json({ message: "Document not found" });
    }

    const absolutePath = path.join(UPLOAD_DIR, document.fileUrl);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File is missing from storage" });
    }

    return res.download(absolutePath, document.fileName);
  } catch (error) {
    console.log("Error in downloadDocument controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Delete a document (removes DB record and the file on disk)
//@route           DELETE /api/documents/:id
//@access          Protected - requires "document:delete" permission
export const deleteDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findOne({ _id: id, uploadedBy: req.user._id });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const absolutePathToDelete = path.join(UPLOAD_DIR, document.fileUrl);
    fs.unlink(absolutePathToDelete, (err) => {          // remove the physical file, but don't fail the request if it's already gone
      if (err) {
        console.log("Warning: could not delete file from disk:", err.message);
      }
    });

    await document.deleteOne();

    return res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.log("Error in deleteDocument controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Approve or reject a document
//@route           PATCH /api/documents/:id/status
//@access          Protected - requires "document:approve" permission
export const updateApprovalStatus = async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  try {
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be 'Approved' or 'Rejected'" });
    }

     if (status === "Rejected" && !comment?.trim()) {
      return res.status(400).json({ message: "A comment is required when rejecting a document" });
    }

    // note: approvers are NOT scoped to uploadedBy - a Manager/Admin needs to act on
    // documents they didn't upload themselves. Once sharing/team scoping exists,
    // tighten this query to only documents visible to the approver's team.
    const document = await Document.findByIdAndUpdate(
      id,
      {
        approvalStatus: status,
        rejectionComment: status === "Rejected" ? comment.trim() : null,
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
      },
      { new: true }
    );
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json(document);
  } catch (error) {
    console.log("Error in updateApprovalStatus controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};