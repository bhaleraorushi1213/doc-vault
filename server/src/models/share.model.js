import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sharedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    permission: {
      type: String,
      enum: ["Read", "Write", "Download"],
      default: "Read",
    },
  },
  {
    timestamps: true,
  }
);

shareSchema.index({ document: 1, sharedWith: 1 }, { unique: true });

const Share = mongoose.model("Share", shareSchema);export default Share;
