const assignModel = require("./model/assign");
app.post("/create", async (req, res) => {
  const data = req.body;
  const rs = await assignModel.create(data);
  return res.send({ success: true, data: rs });
});

app.get("/list", async (req, res) => {
  const rs = await assignModel.find();
  return res.send({ success: true, data: rs });
});
