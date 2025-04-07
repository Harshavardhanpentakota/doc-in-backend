const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    author: {
      id: { type: String, required: true }, // User ID (Clerk or similar)
      name: { type: String, required: true },
      avatar: { type: String },
      role: { type: String },
      institution: { type: String },
    },
    answers: { type: [{ type: mongoose.Schema.Types.Mixed }], default: [] },
    title: { type: String, required: true },
    content: { type: String, required: true },
    fileAttachments: [{ type: String }], // Cloudinary File Link
  },
  { timestamps: true } // Auto adds createdAt & updatedAt
);

const PostModel = mongoose.model("Post", PostSchema);


// User Schema
const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: {type: String, required: true},
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // References Post model
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel, PostModel };
