const express = require("express");
const router = express.Router();
const User = require("../models/User");


const createRouter = () => {
  router.get("/", async (req, res) => {
    try{
        const users = await User.find();
        return res.send(users) ;   
    } catch(e) {
        res.status(500).send(e);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const user = new User(req.body);
      user.generateToken();
      await user.save();
      res.send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  });
  
  router.post("/sessions", async (req, res) => {
    const user = await User.findOne({username: req.body.username});

    const errorMessage = "Wrong username or password";

    if (!user) return res.status(400).send({error: errorMessage});

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) return res.status(400).send({error: errorMessage});

    user.generateToken();
    try {
      await user.save({ validateBeforeSave: false });
    } catch(e) {
      res.status(500).send(e);
    }

    res.send({user});
  });

  router.delete("/sessions", async (req, res) => {
    const token = req.get("Authenticate");
    const success = {message: "Success"};

    if (!token) return res.send(success);

    const user = await User.findOne({token});

    if (!user) return res.send(success);

    user.generateToken();
    try {
      await user.save({ validateBeforeSave: false });
      return res.send(success);
    } catch(e) {
      res.status(500).send(e);
    }
});

router.get("/:id", async (req, res)=> {
  try {
    const author = await User.findById(req.params.id);
    if(author) {
      res.send(author);
    } else {
      res.sendStatus(400);
    }
  } catch(e) {
    res.sendStatus(500);
  }
});

  return router;
};


module.exports = createRouter;
