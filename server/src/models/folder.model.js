import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    folderName: {
      type: String,
      required: true,
      trim: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// prevents the same user from creating two folders with the same name in the same parent
folderSchema.index({ folderName: 1, parent: 1, owner: 1 }, { unique: true });

const Folder = mongoose.model("Folder", folderSchema);
export default Folder;