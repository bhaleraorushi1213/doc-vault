import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { signup, login, logout, checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();

// we are calling methods from here cause we don't want to make this file with large lines of code
router.post("/signup", signup); 
router.post("/login", login);
router.post("/logout", logout);

// above routes don't need protectRoute middleware cause they are outside the application means starting points


router.get("/check", protectRoute , checkAuth);  // this route checks if user is authenticated we will use protectRoute for all routes from now on

// this is where all routes related to user will be defined like if he wanted to update profile delete account etc....


export default router;