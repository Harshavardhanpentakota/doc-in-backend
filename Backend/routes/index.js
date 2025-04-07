const express = require("express");
const router=express.Router();
const {postRouter} = require('./post');
const {uploadFileRouter} = require('./uploadFile');

router.use("/posts",postRouter);
router.use("/file", uploadFileRouter);

module.exports = {router:router};