const jimp = require("jimp")
const path = require('path');
// var jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const express = require('express')
// const session = require('express-session');
const multer = require("multer");
const loaiSP = require("../molde/loaiSP")
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

app.get("/typeProduct", (req, res) => {
    res.render("typeProduct")
})

app.get("/getAllLoaiSP", async (req, res) => {
    await loaiSP.find({})
        .then(item => {
            res.render("typeProduct", {
                loaiSP: item.map(ite => ite.toJSON())
            })
        })
})

app.get("/delete/:id", (req, res) => {
    loaiSP.findByIdAndDelete({ _id: req.params.id })
        .then(() => res.redirect("/typeProduct/getAllLoaiSP"))
})

app.get("/addTypeSP", (req, res) => {
    res.render("addLoaiSP")
})

app.get("/update/:id", async (req, res) => {
    try {
        await loaiSP.findById({ _id: req.params.id })
            .then(item => {
                res.render("editLoaiSP", {
                    item: item.toJSON(),
                })
            })
    } catch (error) {
        console.log(error)
    }
})

app.post("/insertLoaiSP", upload.single("image"), async (req, res) => {
    try {

        const imagePath = req.file.path;
        const image = await jimp.read(imagePath);
        const base64Image = await image.getBase64Async(jimp.AUTO);
        const name = req.body.name
        const data = new loaiSP({ image: base64Image, name: name })
        await data.save()
        res.redirect("/typeProduct/getAllLoaiSP")
    } catch (error) {
        console.log(error)
    }

})

app.put("/updateLoaiSP/:id", upload.single("image"), async (req, res) => {
    try {
        const name = req.body.name
        if (req.file && req.file.path) {
            const imagePath = req.file.path;
            const image = await jimp.read(imagePath);
            const base64Image = await image.getBase64Async(jimp.AUTO);
            await loaiSP.findByIdAndUpdate({ _id: req.params.id }, {
                name: name, image: base64Image
            })
            res.redirect("/typeProduct/getAllLoaiSP")
        } else {
            await loaiSP.findByIdAndUpdate({ _id: req.params.id }, {
                name: name
            })
            res.redirect("/typeProduct/getAllLoaiSP")
        }
    } catch (error) {
        console.log(error)
    }
})


module.exports = app;