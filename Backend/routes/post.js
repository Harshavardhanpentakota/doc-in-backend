const { UserModel, PostModel} = require("../models/User"); 
const express = require("express");
const postRouter=express.Router();

const createPost = async (req, res) => {
  try {
    const { id, author, title, content, fileAttachments } = req.body;
    const files = fileAttachments.map((file) => file.url)
    // Create a new post
    const newPost = new PostModel({ author ,id, title, content, files  });
    await newPost.save();

    // Find the user and update their posts array
    const user = await UserModel.findOneAndUpdate(
      { id },
      { $push: { posts: newPost._id } },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: "Post created successfully", post: newPost, user });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

const postAnswer = async (req, res) => {
  try {
    const { id, author, content } = req.body;

    // Validate input (optional but recommended)
    if (!id || !author || !content) {
      return res.status(400).json({ error: "Missing required fields (id, author, content)." });
    }

    // Find the post by its ID
    const post = await PostModel.findById(id);
    console.log(post);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Create the new answer object
    const newAnswer = {
      author: {
        id: author.id, // Extract userId from author.id
        name: author.name,
        avatar: author.avatar,
        role: author.role,
        institution: author.institution,
        specialization: author.specialization,
      },
      content,
      createdAt: (new Date()).toString(), // Set the answer's creation time
    };

    // Add the new answer to the post's answers array
    post.answers.push(newAnswer);

    // Save the updated post
    await post.save();

    // Send a success response
    res.status(201).json({ message: "Answer posted successfully.", answer: newAnswer });
  } catch (error) {
    console.error("Error posting answer:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post and populate the user who created it
    const post = await PostModel.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the user who created this post
    const user = await UserModel.findOne({ posts: postId });

    res.status(200).json({ post, user });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};

const getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find user and populate their posts
      const user = await UserModel.findOne({ userId }).populate("posts");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({ posts: user.posts });
    } catch (error) {
      res.status(500).json({ error: "Server Error", details: error.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
      const posts = await PostModel.find().sort({ createdAt: -1 }); // Sort by newest
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts", error });
    }
};

const getQuestionDetails = async (req, res) => {
    try {
      const {id}  = req.params;
      const question = await PostModel.findById(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({ message: "Error fetching question details", error });
    }
  };
  
postRouter.post("/createPost", createPost);
postRouter.get("/getPostById/:postId", getPostById);
postRouter.get('/getUserPosts/:userId', getUserPosts);
postRouter.get('/getAllPosts', getAllPosts);
postRouter.post('/postAnswer', postAnswer);
postRouter.get('/getQuestionDetails/:id', getQuestionDetails);

module.exports = { postRouter };
