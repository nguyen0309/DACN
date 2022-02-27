const express = require("express")
const router = express.Router()
const messagesCtr = require("../../controllers/message")

router
    .post("/create", messagesCtr.create)
    .get("/list/:id", messagesCtr.list)
    // .get("/list", messagesCtr.list)

module.exports = router