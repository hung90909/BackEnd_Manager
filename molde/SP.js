const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SP = new Schema({
    image:String,
    name: String,
    nameType: String,
    price: Number,
    number: Number,
    id_LoaiSP: String,
  });
module.exports = mongoose.model("SP",SP);