const express = require("express");
const userRoute = express.Router();
const userCtr = require("../../controllers/user")
const auth = require("../../middleware/authToken")

userRoute
    .post("/list", userCtr.list)
    .get("/get/:id", userCtr.get)
    .post("/create", userCtr.create)
    .post("/update/:id", userCtr.update)
    .delete("/delete/:id", userCtr.delete)
    .post("/ban/:id", userCtr.ban)
    .get("/check-token",auth ,userCtr.checkToken)

module.exports = userRoute