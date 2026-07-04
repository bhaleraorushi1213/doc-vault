import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { getAllUsers, updateUserRole } from "../controllers/user.controller.js";

const router = express.Router();

// every route here requires a logged-in Admin
router.use(protectRoute, authorizeRoles("Admin"));

router.get("/", getAllUsers);
router.patch("/:id/role", updateUserRole);

export default router;