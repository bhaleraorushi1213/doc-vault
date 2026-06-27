import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// we will check everytime if user is authenticated using this route as a middleware when he makes a request using jwt

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // this is the jwt token that we will send to the user

    if(!token) {
      return res.status(401).json({message: "Unauthorized - No Token Provided"});
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // this is the secret key that we will use to verify the token using our private key
    } catch (error) {
      console.log("Error in protectRoute middleware", error.message);
      return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }

    if(!decoded?.userId) {
      return res.status(401).json({message: "Unauthorized - Invalid Token"})
    }

    const user = await User.findById(decoded.userId) // we are searching user in database if exists or not

    if(!user) {
      return res.status(401).json({message: "User not found"});
    }

    req.user = user; // this is the user that we will use to send to the next middleware

    next(); // this is the next middleware which will be called if the user is authenticated means whatever process after this want to be done

  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  } 
}

