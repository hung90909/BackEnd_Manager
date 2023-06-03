const jimp = require("jimp")
const path = require('path');
// var jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const express = require('express')
// const session = require('express-session');
const multer = require("multer");
const SP = require("../molde/SP")
const LoaiSP = require("../molde/loaiSP")
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

app.get("/product", (req, res) => {
    res.render("product")
})
app.get("/getAllSP", async (req, res) => {
    await SP.find({})
        .then(item => {
            res.render("product", {
                SP: item.map(ite => ite.toJSON())
            })
        }).catch(err => console.log(err))
})

app.get("/delete/:id" , (req , res) =>{
    SP.findByIdAndDelete({_id:req.params.id})
    .then(() => res.redirect("/product/getAllSP"))
    .catch(err => console.log(err))
})

// app.get("/getLoaiSP",async(req , res) =>{
//    try {
//       await LoaiSP.findById({_id:})
//    } catch (error) {
//       console.log(error)
//    }
// })

const getNameLoaiSP = async () => {
    try {
      const list = await LoaiSP.find();
      return list.map(item => item.name);
    } catch (error) {
      console.log(error);
    }
  }
  
  app.get("/addSP", async (req, res) => {
    try {
      const nameList = await getNameLoaiSP(); // Sử dụng await để chờ hàm getNameLoaiSP hoàn thành
      res.render("addSP", { nameList }); // Truyền danh sách tên loại sản phẩm vào res.render
    } catch (error) {
      console.log(error);
      res.status(500).send("Lỗi truy vấn CSDL"); // Xử lý lỗi nếu có
    }
  });

  app.post("/insertSP",upload.single("image"), async (req, res) => {
    try {
      const {name , nameType ,price ,number} = req.body;
      const imagePath = req.file.path;
      const image = await jimp.read(imagePath);
      const base64Image = await image.getBase64Async(jimp.AUTO);

      const sp = new SP({name , nameType , price , number , image : base64Image})
      await sp.save();
      res.redirect("/product/getAllSP")
    } catch (error) {
      console.log(error)
    }
  })
  

  app.get("/update/:id",async(req , res) =>{
     try {
       await SP.findById({_id:req.params.id})
       .then(item => {
        res.render("editSP",{
           item: item.toJSON(),
        })
       })
     } catch (error) {
        console.log(error)
     }
  })

  app.put("/editSP/:id", upload.single("image"),async (req  ,res)=>{
    try {
      const {name , nameType ,price ,number} = req.body;
      if(req.file && req.file.path){
        const imagePath = req.file.path;
        const image = await jimp.read(imagePath);
        const base64Image = await image.getBase64Async(jimp.AUTO);

        await SP.findByIdAndUpdate({_id:req.params.id},{
          name , nameType ,price ,number , image:base64Image
        })
        res.redirect("/product/getAllSP")
      }else{
        await SP.findByIdAndUpdate({_id:req.params.id},{
          name , nameType ,price ,number 
        })
        res.redirect("/product/getAllSP")
      }
    } catch (error) {
      console.log(error)
    }
  })
module.exports = app;