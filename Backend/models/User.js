const mongoose = require("mongoose");

// -------------------- Post Schema --------------------
const PostSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    author: {
      userId: { type: String, required: true },
      name: { type: String, required: true },
      avatar: { type: String },
      role: { type: String },
      institution: { type: String },
    },
    answerableByEveryone: { type: Boolean, required: true },
    tags: { type: [String], default: [] },
    answers: { type: [{ type: mongoose.Schema.Types.Mixed }], default: [] },
    title: { type: String, required: true },
    content: { type: String, required: true },
    fileAttachments: [{ type: String }],
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", PostSchema);

// -------------------- User Schema --------------------
const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true }, // Clerk ID
    email: { type: String, required: true },
    institution: { type: String, required: true },
    role: { type: String, enum: ["student", "professional"], required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

// -------------------- Student Profile --------------------
const StudentProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    email: { type: String, required: true },
    institution: { type: String, required: true },
    college: { type: String, required: true },
    year: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const StudentModel = mongoose.model("StudentProfile", StudentProfileSchema);

// -------------------- Medical Professional Profile --------------------
const MedicalProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    email: { type: String, required: true },
    hospital: { type: String, required: true },
    institution: { type: String, required: true },
    specialization: [{ type: String, required: true }],
    abhaNumber: { type: String, required: true },
    linkedin: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

const MedicalModel = mongoose.model("MedicalProfile", MedicalProfileSchema);

// -------------------- Export --------------------
module.exports = {
  UserModel,
  PostModel,
  StudentModel,
  MedicalModel,
};
