const express = require("express");
const taskRoute = express.Router();
const taskCtr = require("../../controllers/task")
const auth = require("../../middleware/authToken")

taskRoute
    .get("/get/:id", taskCtr.get)
    .post("/list", taskCtr.list)
    .post("/create", auth, taskCtr.create)
    .post("/update/:id", auth, taskCtr.update)
    .delete("/delete/:id", taskCtr.delete)
module.exports = taskRoute