import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './lib/db.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
  connectDB();
})
