const express = require("express");
const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());

// Registration
exports.Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        Status: "Failed",
        Message: "please provide USERNAME, EMAIL and PASSWORD",
      });
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(401).json({
        Status: "Failed",
        Message: "This Account is Already Created",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = User.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, "qwerty12345", {
      expiresIn: "90d",
    });
    res.status(200).json({
      Status: "Success",
      Message: "Account Has Been Created",
      UserName: username,
      Token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      Status: "Failed",
      Message: "Failure While Creating Account",
    });
  }
};

// Login
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!email || !password) {
      return res.status(400).json({
        Status: "Failed",
        Message: "please provide EMAIL and PASSWORD",
      });
    }

    if (!user) {
      return res.status(401).json({
        Status: "Failed",
        Message: "User Not Found With This Email Id",
      });
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return res.status(402).json({
        Status: "Failed",
        Message: "Password is incorrect",
      });
    }

    const token = jwt.sign({ id: user._id }, "qwerty12345", {
      expiresIn: "90d",
    });

    res.status(200).json({
      Status: "Success",
      Message: "Login  SuccessFull",
      UserName: user.username,
      Data: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Status: "Failed",
      Message: "Failure While Login Account",
    });
  }
};
