const mongoose = require('mongoose');
const {nanoid} = require("nanoid");
const config = require('./config');

const Photo = require('./models/Photo');
const User = require('./models/User');

mongoose.connect(config.db.url + config.db.name, {useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true});

const db = mongoose.connection;

db.once('open', async () => {
  try {
    await db.dropCollection('photos');
    await db.dropCollection('users');

  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const[user18, user19] = await User.create({
    username: "user18",
    password: "123",
    token: nanoid(),
  }, {
    username: "user19",
    password: "123",
    token: nanoid(),
  });

  await Photo.create({
    title: "Los Angeles",
    image: "la.jpg",
    user: user18._id,
    username: "user18"
  }, {
    title: "Chicago",
    image: "chicago.jpg",
    user: user18._id,
    username: "user18"
  }, {
    title: "New York",
    image: "ny.jpg",
    user: user19._id,
    username: "user19"
  }, {
    title: "Seattle",
    image: "seattle.jpg",
    user: user19._id,
    username: "user19"
  });

  db.close();
});
