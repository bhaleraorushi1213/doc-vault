import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';

import authRoutes from "./routes/auth.route.js";
import folderRoutes from "./routes/folder.route.js";
import userRoutes from "./routes/user.route.js";
import documentRoutes from "./routes/document.route.js";
import { connectDB } from './lib/db.js';

dotenv.config();                              // this is allowes to load environment variables from a .env file

const app = express();                        // this is our express app 

const PORT = process.env.PORT;                // this is the port that the server will listen on
const __dirname = path.resolve();

app.use(express.json());                      // this is added to parse json data sent from the frontend
app.use(cookieParser());                      // this is added to parse cookies sent from the frontend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))                                           // this is added to allow cross-origin requests from the frontend cause it is running on a different port

app.use("/api/auth", authRoutes);             // this is our authentication route 
app.use("/api/folders", folderRoutes);        // this is our folder management route
app.use("/api/users", userRoutes);            // this is our admin user-management route
app.use("/api/documents", documentRoutes);    // this is our document upload/management route

// centralized error handler - normalize Multer and upload errors to JSON
app.use((err, req, res, next) => {
  if (!err) return next();

  // Multer errors often have name 'MulterError' and code like 'LIMIT_FILE_SIZE'
  if (err.name === "MulterError" || (err.code && String(err.code).startsWith("LIMIT_"))) {
    return res.status(400).json({ message: err.message || "File upload error" });
  }

  // fileFilter in upload.middleware throws a regular Error with a message about file type
  if (err.message && err.message.startsWith("File type")) {
    return res.status(400).json({ message: err.message });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Internal server error" });
});

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
  });
})
.catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});