import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";

// this is where we will define all routes functionality related to user or users
//@description     Register new user
//@route           POST /api/auth/signup
//@access          Public
export const signup = async (req, res) => {
  const { email, name, password } = req.body; // getting name, email, password from request send by frontend

  try {

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email }); // finding user in database if exists or not

    if (user) return res.status(400).json({ message: "Email already exists" }); // send error if exists

    const salt = await bcrypt.genSalt(10);  // this will generate a salt means random letters to add to password to make it un decryptable
    const hashedPassword = await bcrypt.hash(password, salt);  // here we hashed our password with salt

    // creating new user with hashed password 
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save(); // saved newUser in database
      generateToken(newUser._id, res); // generating token and sending it to user

      // sending success response with users details to frontend
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.fullName,
        email: newUser.email,
        // isAdmin: newUser.isAdmin,
        profilePicture: newUser?.profilePicture || ""
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

//@description     Login the user
//@route           POST /api/auth/login
//@access          Public 

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password"); //finding user in database

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // self explanatory cause of variable name 😅
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("checking pssword", isPasswordCorrect)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user?.profilePicture || "",
    })

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" })
  }
}

//@description     logout the user
//@route           POST /api/auth/logout
//@access          Public
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

//@description     Auth the user
//@route           POST /api/auth/check
//@access          rotected
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};