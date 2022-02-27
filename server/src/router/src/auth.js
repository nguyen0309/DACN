const express = require("express");
const authRoute = express.Router();
const authCtr = require("../../controllers/auth")
 
authRoute
    .post("/login", authCtr.login)

module.exports = authRoute