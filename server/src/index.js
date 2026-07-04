import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from 'cors';

import authRoutes from "./routes/auth.route.js";
import folderRoutes from "./routes/folder.route.js";
import userRoutes from "./routes/user.route.js";
import documentRoutes from "./routes/document.route.js";
import { connectDB } from './lib/db.js';

dotenv.config();                              // this is allowes to load environment variables from a .env file

const app = express();                        // this is our express app 

const PORT = process.env.PORT;                // this is the port that the server will listen on

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

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
  connectDB();
})