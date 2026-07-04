import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/authorize.middleware.js";
import {
  createFolder,
  getFolders,
  getFolderContents,
  renameFolder,
  deleteFolder,
} from "../controllers/folder.controller.js";

const router = express.Router();

// every folder route requires the user to be logged in
router.use(protectRoute);

router.post("/", requirePermission("folder:create"), createFolder);
router.get("/", getFolders);
router.get("/:id", getFolderContents);
router.patch("/:id", renameFolder);
router.delete("/:id", deleteFolder);

export default router;