const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config.js");
const photos = require("./app/photos");
const users = require("./app/users");

const app = express();

const port = 8000;

const run = async () => {
  await mongoose.connect(config.getDbUrl(), {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

  app.use(cors());
  app.use(express.json());
  app.use(express.static('public'));
  app.use("/photos", photos());
  app.use("/users", users());

  app.listen(port, () => {
    console.log("Server started at http://localhost:" + port);
  });
};

run().catch(e => console.log(e));
