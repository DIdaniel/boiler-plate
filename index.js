const express = require("express");
const app = express();
const port = 5000;
const config = require("./config/key");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("mongoDB 연결잘됐다!!"))
  .catch((err) => conosole.log("mongoDB 연결 실패 ㅠㅠ"));

app.get("/", (req, res) => {
  res.send("Hello World! nodeMon Installed!!!");
});

app.post("/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
