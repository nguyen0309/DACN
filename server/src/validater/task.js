const Joi = require("joi");

const createTask = Joi.object({
  name: Joi.string().required(),
  created_by: Joi.string().required(),
  updated_by: Joi.string(),
  estimate_time: Joi.number(),
  assign: Joi.string(),
  status: Joi.string()
}).required();

const updateTask = Joi.object({
  assign: Joi.string(),
  name: Joi.string(),
  status: Joi.string(),
  estimate_time: Joi.number(),
  updated_by: Joi.string().required(),
  _id: Joi.string().required()
}).required();

module.exports = {
  createTask,
  updateTask
};
