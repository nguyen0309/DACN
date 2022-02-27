const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    phone:{ type: String, required: true },
    password: { type: String, required: true },
    name: String,
    role: {type: Number, default: 2},
    note: String,
    date: String,
    id_socket: String,
    active: {type: Boolean, default: true},
    img: String,
    created_time: {type: Number, default: Date.now()},
    updated_time: {type: Number, default: Date.now()}
  },
);

const users = mongoose.model("users", userSchema);
module.exports = users
