const express = require("express");
const uploadRoute = express.Router();
const uploadCtr = require("../../controllers/upload")
 
uploadRoute
    .post("/", uploadCtr.upload)

module.exports = uploadRoute