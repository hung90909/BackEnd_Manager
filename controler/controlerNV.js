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

app.post("/addNV", upload.single("image"), async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const role = req.body.role;
        const sex = req.body.sex;
        const phone = req.body.phone;
        if (req.file && req.file.path) {
            const imagePath = req.file.path
            const img = await jimp.read(imagePath);
            const baseImage = await img.getBase64Async(jimp.AUTO)
            const nv = new NV({
                email: email, password: password,
                name: name, role: role, image: baseImage, sex: sex, phone: phone
            });
            await nv.save();
            res.redirect('/admin/getAllNV');
        }

    } catch (error) {
        console.log(error);
    }


})


app.get('/', (req, res) => {
    res.redirect('/admin/getAllNV')
})
// app.put('/editNV/:id', upload.single("image"), async (req, res) => {
//     try {
//         console.log(req.body)
//         await NV.findByIdAndUpdate({ _id: req.params.id }, req.body)
//             .then(() => res.send("udpate NV thanh cong"))
//     } catch (error) {
//         console.log(error)
//     }
// })

app.put("/editNV/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, password, sex, email, image } = req.body
        if (req.file && req.file.path) {
            const imagePath = req.file.path;
            const image = await jimp.read(imagePath);
            const base64Image = await image.getBase64Async(jimp.AUTO);

           await NV.findByIdAndUpdate({ _id: req.params.id }, {
                name: name, password: password, sex: sex, email: email, image: base64Image
            })
            res.redirect("/admin/getAllNV")
        }else{
           await NV.findByIdAndUpdate({ _id: req.params.id }, {
                name: name, password: password, sex: sex, email: email, image: image
            })
            res.redirect("/admin/getAllNV")
        }

    } catch (error) {
        console.log(error)
    }
})

app.get('/getAllNV', async (req, res) => {
    try {
        const nv = await NV.find({});
        res.render("listNV", {
            nv: nv.map(user => user.toJSON()),
        })
    } catch (error) {
        console.log(error)
    }
})

app.get('/delete/:id', async (req, res) => {
    try {
        await NV.findByIdAndDelete({ _id: req.params.id })
            .then(() => res.redirect("/admin/getAllNV"))
    } catch (error) {
        console.log(error)
    }
})

app.get('/addNV', (req, res) => {
    res.render("addNV")
})
app.get('/updateNV/:id', async (req, res) => {
    try {
        await NV.findById(req.params.id)
            .then(item => {
                res.render("editNV", {
                    u: item.toJSON()
                })
            })
    } catch (error) {
        console.log(error)
    }

})


module.exports = app;