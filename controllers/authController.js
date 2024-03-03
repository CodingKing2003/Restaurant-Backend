const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");

exports.registerController = async (req, res) => {
  try {
    const { userName, email, password, phone, address, answer } = req.body;
    if (!userName || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({
        success: false,
        message: "Please provide all details",
      });
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).send({
        success: false,
        message: "Already registered, Please login",
      });
    }

    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      phone,
      answer,
    });

    res.status(201).send({
      success: true,
      message: "Successfully registered",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).send({
        success:false,
        message:"Please provide all details"
      })
    }
    const user=await userModel.findOne({email})
    if(!user){
      return res.status(400).send({
        success:false,
        message:"User not found"
      })
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).send({
        success:false,
        message:"Invalid details"
      })
    }

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
      expiresIn:"7d"
    })

    user.password=undefined;

    res.status(200).send({
      success:true,
      message:"Login successfully",
      user,
      token

    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};
