import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import readline from "readline";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

dotenv.config();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    const adminRole = await Role.findOne({ roleName: "Admin" });
    if (!adminRole) {
      console.error("No 'Admin' role found. Run `node lib/seedRoles.js` first.");
      process.exit(1);
    }

    const name = await ask("Admin name: ");
    const email = await ask("Admin email: ");
    const password = await ask("Admin password (min 6 chars): ");

    if (!name || !email || !password || password.length < 6) {
      console.error("All fields are required and password must be at least 6 characters.");
      process.exit(1);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      // if the user already exists (e.g. you signed up normally first), just promote them
      existing.role = adminRole._id;
      await existing.save();
      console.log(`Existing user ${email} promoted to Admin.`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.create({
        name,
        email,
        password: hashedPassword,
        role: adminRole._id,
      });
      console.log(`Admin user ${email} created successfully.`);
    }
  } catch (error) {
    console.error("Error seeding admin:", error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
};

seedAdmin();