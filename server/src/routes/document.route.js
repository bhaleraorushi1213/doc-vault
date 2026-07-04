import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/authorize.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  deleteDocument,
  downloadDocument,
  getDocumentById,
  getDocuments,
  updateApprovalStatus,
  uploadDocument
} from "../controllers/document.contoller.js";

const router = express.Router();

// every document route requires a logged-in user
router.use(protectRoute);

router.post("/", requirePermission("document:upload"), upload.single("file"), uploadDocument);
router.get("/", requirePermission("document:read"), getDocuments);
router.get("/:id", requirePermission("document:read"), getDocumentById);
router.get("/:id/download", requirePermission("document:read"), downloadDocument);
router.delete("/:id", requirePermission("document:delete"), deleteDocument);
router.patch("/:id/status", requirePermission("document:approve"), updateApprovalStatus);

export default router;