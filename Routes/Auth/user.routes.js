const express = require("express");
const User = require("../../Models/user.model.js");
const jwt = require("jsonwebtoken");
const server = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
server.post("/signup", async (req, res) => {
  let { name, email, password, pic } = req.body;

  try {
    let existinguser = await User.findOne({ email });
    if (existinguser) {
      res.status(404).send('we can"t able to create email alreay in use');
    } else {
      const salt = await bcrypt.genSalt(10);
      const crypted = await bcrypt.hash(password, salt);
      console.log(crypted);
      if (pic) {
        let user = await User.create({
          name,
          email,
          password: crypted,
          pic,
        });
      } else {
        let user = await User.create({
          name,
          email,
          password: crypted,
        });
      }
      return res.status(201).send("User created successfully");
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
});

server.post("/signin", async (req, res) => {
  let { password, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user.password) {
      console.log(user);
      let verifyed = await bcrypt.compare(password, user.password);
      if (verifyed) {
        console.log(verifyed);
        if (user.pic) {
          let data = {
            name: user.name,
            email,
            pic: user.pic,
            user:user.user
          };

          const token = await jwt.sign(data,"ZEE5");
          console.log(token);
          res.cookie("karthik",token)
          return res.send(token);
        }
        let data = {
          name: user.name,
          email,
          user:user.user
        };

        const token = await jwt.sign(data,"ZEE5");
        console.log(token);
        res.cookie("TOKEN", token);
        return res.status(200).send(token);
      }
      else{
        return res.status(403).send("Wrong Password");
      }
    } else {
      return res.status(403).send("Wrong Password");
    }
  } catch (e) {
    res.status(404).send("Plesae enter correct Email Address");
  }
});

server.get("/",async(req,res)=>{
  try{
    let users = await User.find();
    return res.status(200).send(users)
  }
  catch{
    res.status(404).send(e.message);
  }
})

server.patch("/:id",async(req,res)=>{
  const {id} = req.params;
  const body  = req.body;
  try{
    let updated = await User.updateOne({_id:id},{$set:body});
    return res.status(200).send(updated)
  }
  catch{
    res.status(404).send(e.message);
  }
})

server.get("/:id",async(req,res)=>{
  const {id} = req.params;
  try{
    let user = await User.findOne({_id:id});
    return res.status(200).send(user)
  }
  catch{
    res.status(404).send(e.message);
  }
})

server.delete("/:id",async(req,res)=>{
  const {id} = req.params;
  try{
    let Del = await User.deleteOne({_id:id});
    return res.status(200).send(Del)
  }
  catch{
    res.status(404).send(e.message);
  }
})
module.exports = server;
