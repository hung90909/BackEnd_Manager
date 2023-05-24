const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nhanVien = new Schema({
    image:String,
    email: String,
    name: String,
    password:String,
    sex:String,
    phone:String,
    role:String,
  });
module.exports = mongoose.model("nhanVien",nhanVien);