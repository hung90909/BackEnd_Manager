const jimp = require("jimp")
const path = require('path');
// var jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const express = require('express')
// const session = require('express-session');
const multer = require("multer");
const NV = require("../molde/nhanVien");
const { json } = require("stream/consumers");
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // tên file
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // giới hạn kích thước file tải lên là 2MB
});

app.post("/addNV",upload.single("image"),async (req , res)=>{
    const nv = new NV(req.body)
    await nv.save()
    res.send("Them NV thanh cong")
    
})

app.put('/editNV/:id',upload.single("image"),async (req , res)=>{
    try {
         console.log(req.body)
         await NV.findByIdAndUpdate({_id:req.params.id},req.body)
         .then(()=> res.send("udpate NV thanh cong"))
    } catch (error) {
        console.log(error)
    }
})
app.get('/getAllNV', async (req, res)=>{
    try {
        await NV.find()
        .then(item=> res.json(item))
    } catch (error) {
        console.log(error)
    }
})

app.delete('/deleteNV/:id' ,async (req, res)=>{
    try {
        await NV.findByIdAndDelete({_id: req.params.id})
        .then(()=> res.send("Xoa NV thanh cong"))
    } catch (error) {
        console.log(error)
    }
})

module.exports = app;