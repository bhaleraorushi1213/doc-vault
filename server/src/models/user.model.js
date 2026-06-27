import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false
    }, 
    profilePicture: {
      type: String
    },
    department: {
      type: String
    },
    // role: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Role",
    //   required: true
    // },
    status: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;