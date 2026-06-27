import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
 const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
  
  // this is the secret key that we will use to sign the token we will use this secret key to verify the token we will send this json web 
 //  everytime we receive a request from the client

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,// 7days in milliesecond
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });// this is the cookie that will be sent to the client

}