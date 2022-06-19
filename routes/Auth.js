const router = require("express").Router();
var CryptoJS = require("crypto-js");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


// Register a new user
router.post("/register", async (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt( req.body.password, process.env.SECURED_KEY ).toString(),
    });

    try {
        await user.save();
        res.status(201).send({ user });
    } catch (error) {
        res.status(400).send(error);
    }
});

//User login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const accessToken = jwt.sign(
      {
        _id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.SECURED_KEY,
      { expiresIn: "1h" }
    );

    const decrypted = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECURED_KEY
    ).toString(CryptoJS.enc.Utf8);
    if (decrypted === req.body.password) {
      res.json({ message: "User logged in", accessToken });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (err) {
    res.json({ message: err });
  }
});


 
module.exports = router;
