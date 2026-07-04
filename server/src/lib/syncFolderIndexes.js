// run this ONCE if you're seeing unexpected "already exists" duplicate-key errors
// on folders - it drops any indexes on the collection that don't match the current
// schema and rebuilds the correct ones
//
// usage: node lib/syncFolderIndexes.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Folder from "../models/folder.model.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected. Current indexes on 'folders':");
    console.log(await Folder.collection.getIndexes({ full: true }));

    const result = await Folder.syncIndexes();
    console.log("Dropped/rebuilt indexes:", result);

    console.log("Indexes after sync:");
    console.log(await Folder.collection.getIndexes({ full: true }));
  } catch (error) {
    console.error("Error syncing indexes:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();