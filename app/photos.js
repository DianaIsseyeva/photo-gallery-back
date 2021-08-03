const express = require("express");
const multer = require("multer");
const {nanoid} = require("nanoid");
const path = require("path");
const Photo = require("../models/Photo");
const User = require("../models/User");
const config = require("../config");
const router = express.Router();
const auth = require('../middleware/auth');
const ValidationError = require("mongoose").Error.ValidationError


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  }
});

const upload = multer({storage});

const createRouter = () => {
  router.get("/", async (req, res) => {
    const photos = await Photo.find();
    res.send(photos);
  });

  router.get("/:id", async (req, res) => {
    try {
      const photos = await Photo.find({user: req.params.id});
      if (photos) {
        res.send(photos);
      } else {
        res.sendStatus(404);
      }
    } catch(e) {
      res.sendStatus(500);
    }
  });

  router.post("/", [auth, upload.single("image")], async (req, res) => {
    const photo = {...req.body};
    if (req.file) {
      photo.image = req.file.filename;
    }
    const result = new Photo(photo);
    result.user = req.user._id;
    result.username = req.user.username;

    try {
      await result.save();
      res.send(result);
    } catch (err) {
        if(err instanceof ValidationError) {
            res.status(400).send(err);
        }
        else {
            res.sendStatus(500)
        }
    }
  });


  router.delete("/:id", auth, async (req, res) => {
    try{
      const photo = await Photo.findById(req.params.id);
      const token = req.get("Authenticate");
      const user =  await User.findOne({token}) 
      if(photo) {
        if(String(photo.user)===String(user._id)) {
          await Photo.deleteOne({_id: photo.id});
          res.send("Photo deleted success");
        } else {
          res.send("Wrong token")
        }
      } else {
        res.sendStatus(404);
      }
    } catch(e) {
      res.sendStatus(500);
    }
  });


  return router;
};


module.exports = createRouter;
