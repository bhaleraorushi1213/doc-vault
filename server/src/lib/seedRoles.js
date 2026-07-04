// run this once against your DB before letting anyone sign up:
//   node lib/seedRoles.js
// it's idempotent - safe to re-run, it won't create duplicates

import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/role.model.js";

dotenv.config();

const DEFAULT_ROLES = [
  {
    roleName: "Admin",
    permissions: [
      "document:upload",
      "document:read",
      "document:write",
      "document:delete",
      "document:approve",
      "document:share",
      "folder:create",
      "folder:manage",
      "user:manage",
      "role:manage",
    ],
  },
  {
    roleName: "Manager",
    permissions: [
      "document:upload",
      "document:read",
      "document:write",
      "document:approve",
      "document:share",
      "folder:create",
      "folder:manage",
    ],
  },
  {
    roleName: "Employee",
    permissions: [
      "document:upload",
      "document:read",
      "document:share",
      "folder:create",
    ],
  },
];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding roles...");

    for (const roleData of DEFAULT_ROLES) {
      const existingRole = await Role.findOne({ roleName: roleData.roleName });

      if (existingRole) {
        // keep permissions in sync in case you edit the list above and re-run
        existingRole.permissions = roleData.permissions;
        await existingRole.save();
        console.log(`Updated role: ${roleData.roleName}`);
      } else {
        await Role.create(roleData);
        console.log(`Created role: ${roleData.roleName}`);
      }
    }

    console.log("Role seeding complete.");
  } catch (error) {
    console.error("Error seeding roles:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedRoles();