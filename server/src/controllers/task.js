const taskModel = require("../models/task");
const schema = require("../validater/task");
const userModel = require("../models/user");
class taskCtr {
  static async create(req, res) {
    try {
      const data = req.body;
      data.created_by = req.user_id;
      data.updated_by = req.user_id;
      await schema.createTask.validateAsync(data);
      let count = await taskModel.countDocuments();
      data.code = "CV-" + count;
      const rs = await taskModel.create(data);
      return res.send({ success: true, data: rs });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const _id = req.params.id;
      let data = req.body;
      data._id = _id;
      data.updated_by = req.user_id;
      await schema.updateTask.validateAsync(data);
      const rs = await taskModel.findOneAndUpdate({ _id }, data, { new: true });
      return res.send({ success: true, data: rs });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async get(req, res) {
    try {
      const _id = req.params.id;
      if (!_id) return res.status(500).send({ success: false, message: "No id" });
      let rs = await taskModel
        .findOne({ _id })
        .populate({ path: "updated_by", select: "-password" })
        .populate({ path: "created_by", select: "-password" });
      let findAssign = await userModel.findOne({ _id: rs.assign }).select("-password");
      rs._doc.map_assign = findAssign;
      return res.send({ success: true, data: rs });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const _id = req.params.id;
      if (!_id) return res.status(500).send({ success: false, message: "No id" });
      const rs = await taskModel.findOneAndDelete({ _id });
      return res.send({ success: true, data: rs });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
      const { search, sort, skip, limit, filter } = req.body;
      let condition = {};
      taskCtr.mapFilter(condition, search, filter);
      let arrStatus = condition.status
        ? condition.status["$in"]
        : ["todo", "in-process", "need-test", "approved"];
      let rs = await Promise.all(
        arrStatus.map(async (status) => {
          let cond = { ...condition, status };
          let find = await taskModel
            .find(cond)
            .sort(sort || { created_time: -1 })
            .skip(Number(skip) || 0)
            .limit(Number(limit) || 20);
          let count = await taskModel.countDocuments(cond);
          return { status, list: find, count };
        })
      );
      return res.send({ success: true, data: rs });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async mapFilter(condition, search, filter) {
    if (search) {
      let reg = new RegExp(`.*${search}.*`, i);
      condition[$or] = {
        name: reg,
        code: reg,
      };
    }
    if (!filter) return condition;
    if (filter.assign_to) {
      condition.assign = filter.assign_to;
    }
    if (filter.status && Array.isArray(filter.status)) {
      condition.status = {
        $in: filter.status,
      };
    }
    return condition;
  }
}

module.exports = taskCtr;
