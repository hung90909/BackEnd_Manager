const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loaiSP = new Schema({
    image:String,
    name: String,
    
  });
module.exports = mongoose.model("loaiSP",loaiSP);