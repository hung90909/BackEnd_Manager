const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const methods = require("method-override");
const nhanVien = require("./controler/controlerNV");
const port = 9999;
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methods("_method"));
app.use(express.static("image"));
mongoose
  .connect("mongodb://127.0.0.1:27017/Manager_ISore")
  .then(function () {
    console.log("Kết nối thành công !");
  })
  .catch(function (err) {
    console.log("error: " + err);
  });
app.engine(
  ".hbs",
  handlebars.engine({
    extname: "hbs",
    helpers: {
      sum: (a, b) => a + b,
    },
  })
);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use("/Admin", nhanVien);
app.listen(port, function () {
  console.log("http://localhost:" + port+"/Admin");
});
