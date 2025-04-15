const express = require("express");
const router=express.Router();
const {postRouter} = require('./post');
const {uploadFileRouter} = require('./uploadFile');
const {userRouter} = require('./user');

router.use("/posts",postRouter);
router.use("/file", uploadFileRouter);
router.use("/user",userRouter);

module.exports = {router:router};