const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: String,
  assign: {type: Boolean, default: false},
  estime: {type: String, default: "0"},
  status: {type: String, default: "start"},
  created_time: { type: Number, default: Date.now()},
  update_time: { type: Number, default: Date.now()}
});

module.exports = mongoose.model('task', taskSchema)