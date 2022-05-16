require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const roles = require("./models/role");
const users = require("./models/user");
const conversions = require("./models/conversions");
const bcrypt = require("bcryptjs");
const router = require("./router");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "src/tmp/",
  })
);
app.use(express.json());
app.use(cors());
app.use(router);
const server = require("http").createServer(app);
const socketCtr = require("./controllers/socket");
socketCtr.connectSocket(server);

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      // `mongodb+srv://socket:fbfMyLdSVKDbaR09@dbsocket-app.rwxou.mongodb.net/dbsocket-app?retryWrites=true&w=majority`
      `mongodb://127.0.0.1:27017/socket`
    );
    if (connect) console.log("DB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
connectDB();

const seeder = async (req, res) => {
  try {
    const find = await roles.findOne({
      name: "Administrator",
      role: 0,
      descriptions: "Quyền quản trị cao nhất",
    });

    if (!find) {
      const data = [
        {
          name: "Administrator",
          role: 0,
          descriptions: "Quyền quản trị cao nhất",
        },
        {
          name: "Moderator",
          role: 1,
          descriptions: "Quyền dưới admin",
        },
        {
          name: "Member",
          role: 2,
          descriptions: "Member",
        },
      ];
      await Promise.all(
        data.map(async (value) => {
          await roles.create(value);
        })
      );
    }
    let admin = {};
    const findAdmin = await users.findOne({
      username: "admin",
      name: "admin",
      role: 0,
      note: "admin",
    });
    if (!findAdmin) {
      admin = await users.create({
        name: "admin",
        phone: "0123456789",
        password: bcrypt.hashSync("12345678", 10),
        role: 0,
        note: "admin",
      });
    }

    const findConv = await conversions.findOne({
      name: "Nhóm chung",
      type: "group",
    });
    if (!findConv) {
      await conversions.create({
        members: [admin._id],
        type: "group",
        name: "Nhóm chung",
        sender_id: admin._id,
        sender_name: admin.name,
        receiver_id: admin._id,
        receiver_name: admin.name,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

seeder();

// set port
const PORT = process.env.PORT || 3003;
server.listen(PORT, console.log(`Server run on ${PORT}`));
