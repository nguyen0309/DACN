const express = require("express");
const taskRoute = express.Router();
const taskCtr = require("../../controllers/task")

taskRoute
    .get("/get/:id", taskCtr.get)
    .post("/create", taskCtr.create)
    .post("/update/:id", taskCtr.update)
    .delete("/delete/:id", taskCtr.delete)
module.exports = taskRoute