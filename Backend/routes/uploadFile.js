require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const express = require("express");
const uploadFileRouter = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL, // Using CLOUDINARY_URL
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    resource_type: "auto", // Supports both images and PDFs
  },
});
const upload = multer({ storage });

// Define MongoDB Schema
const FileSchema = new mongoose.Schema({
  url: String,
  fileType: String,
});
const File = mongoose.model("File", FileSchema);

// API to Upload Image/PDF
uploadFileRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Save file URL in MongoDB
    const newFile = new File({
      url: req.file.path,
      fileType: req.file.mimetype.includes("pdf") ? "pdf" : "image",
    });
    await newFile.save();

    res.json({ message: "File uploaded successfully", url: newFile.url });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = { uploadFileRouter };
