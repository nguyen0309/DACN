const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  assign: { type: String, default: "" },
  estimate_time: { type: Number, default: 0 },
  status: { type: String, default: "todo" },
  name: { type: String, require: true },
  code: { type: String },
  priority: { type: String, default: "normal" },
  description: { type: String },
  created_time: { type: Number, default: Date.now },
  update_time: { type: Number, default: Date.now },
  updated_by: { type: Schema.Types.ObjectId, ref: "users" },
  created_by: { type: Schema.Types.ObjectId, ref: "users" },
});

module.exports = mongoose.model("task", taskSchema);
