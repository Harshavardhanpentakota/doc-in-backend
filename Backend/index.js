require("dotenv").config();
const express = require("express");

const cors = require("cors");
const {router} = require("./routes/index");
const connectDB = require("./dbConn");
// Connect to MongoDB

connectDB();

// Express setup
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1',router);

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
