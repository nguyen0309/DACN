const Joi = require("joi");

const createTask = Joi.object({
  name: Joi.string().required(),
  created_by: Joi.string().required(),
  updated_by: Joi.string(),
  priority: Joi.string(),
  estimate_time: Joi.string(),
  assign: Joi.string(),
  description: Joi.string(),
  status: Joi.string(),
}).required();

const updateTask = Joi.object({
  assign: Joi.string(),
  name: Joi.string(),
  status: Joi.string(),
  priority: Joi.string(),
  estimate_time: Joi.string(),
  updated_by: Joi.string().required(),
  description: Joi.string(),
  _id: Joi.string().required(),
}).required();

module.exports = {
  createTask,
  updateTask,
};
