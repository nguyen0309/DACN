const userModel = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

class AuthCtr {
  static async login(req, res) {
    try {
      const data = req.body;
      const find = await userModel.findOne({phone: data.phone});
      if (!find) {
        return res.status(500).send({
          success: false,
          message: "Incorrect email or password. Please check again!",
        });
      } else {
        const checkPass = await bcrypt.compareSync(
          data.password,
          find.password
        ); // true
        if (checkPass) {
          const token = jwt.sign(
            { id: find._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30d" }
          );
          return res
            .status(200)
            .send({ success: true, token, message: "Login success!", data: find });
        } else {
          return res.status(500).send({
            success: false,
            message: "Incorrect email or password. Please check again!",
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = AuthCtr;
