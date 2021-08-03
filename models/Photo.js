const mongoose = require('mongoose');
const idValidator = require("mongoose-id-validator")
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true
  }
});

PhotoSchema.plugin(idValidator, {
  message: "Bad ID value for {PATH}"
});

const Photo = mongoose.model("Photo", PhotoSchema);
module.exports = Photo;
