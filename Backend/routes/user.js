require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const userRouter = express.Router();
const { UserModel, PostModel, StudentModel, MedicalModel } = require("../models/User");
const { v4: uuidv4 } = require('uuid');
const newUserId = uuidv4();


userRouter.post('/create-user', async (req, res) => {
    try {
      const { user, fullDetails } = req.body;
  
      if (!user || !fullDetails) {
        return res.status(400).json({ message: "Missing user or profile details." });
      }
  
      const { userId, email, institution, role } = user;
  
      if ( !userId || !email || !role) {
        return res.status(400).json({ message: "Missing required user fields." });
      }
  
      const existingUser = await UserModel.findOne({ userId: userId });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists." });
      }
  
      const newUser = new UserModel({
        id: uuidv4(),
        userId,
        email,
        institution,
        role,
      });
  
      await newUser.save();
  
      if (role === "student") {
        const { college, year, location } = fullDetails;
  
        if (!college || !year || !location) {
          return res.status(400).json({ message: "Missing student profile fields." });
        }
  
        const studentProfile = new StudentModel({
          userId,
          email,
          institution,
          college,
          year,
          location,
        });
  
        await studentProfile.save();
      } else if (role === "professional") {
        const { hospital, specialization, abhaNumber, linkedin, website, location } = fullDetails;
  
        if (!hospital || !specialization || !abhaNumber) {
          return res.status(400).json({ message: "Missing medical profile fields." });
        }
  
        const medicalProfile = new MedicalModel({
          userId,
          email,
          hospital,
          institution,
          specialization,
          abhaNumber,
          linkedin,
          website,
          location
        });
  
        await medicalProfile.save();
      } else {
        return res.status(400).json({ message: "Invalid role specified." });
      }
  
      res.status(201).json({ message: "User and profile created successfully." });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ message: "Server error creating user." });
    }
  });
  

userRouter.get("/getUserDetails", async (req, res) => {
    try {
      const { id } = req.query;
  
      // Fetch base user data
      const user = await UserModel.findOne({ userId:id }).populate("posts");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      let profileDetails = null;
  
      // Get extended profile based on role
      if (user.role === "student") {
        profileDetails = await StudentModel.findOne({ userId: user.userId });
      } else if (user.role === "professional") {
        profileDetails = await MedicalModel.findOne({ userId: user.userId });
      }
  
      return res.status(200).json({
        message: "User details fetched successfully",
        user,
        profile: profileDetails,
      });
    } catch (err) {
      console.error("Error fetching user details:", err.message);
      return res.status(500).json({
        error: "Server error",
        details: err.message,
      });
    }
  });
module.exports = { userRouter };