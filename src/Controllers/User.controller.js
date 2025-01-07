import User from "../Models/User.module.js";
import { ApiError } from "../utitles/ApiError.utitles.js";
import { ApiResponse } from "../utitles/ApiResponse.utitles.js";
import bcrypt from "bcrypt";

// send Mail to User and find card key for  validation

const sendMail = async (email, cardKey ,userName) => {
  try {
    let transportmail = nodeMailer.createTransport({
      service: "gmail",
      auth: {
         user: "kumawatsubhash388@gmail.com",
         pass: "joejkzhhckdphelr",  // Use environment variable
      },
    });

    let emailContent = {
      from: "kumawatsubhash388@gmail.com",
      to: email,
      subject: "send Card Key  ",
      html: `<p> hiii ${userName} thank you for joining this amazing platfrom for helping other people  , if  you want to Donate & Accept From then you Need <h3>CardKey</h3> : ${cardKey}.
       Thanks you againt .</p>`,
    };

    transportmail.sendMail(emailContent, function (err, val) {
      if (err) {
        console.log(err);
      } else {
        console.log(val.response, "Sent mail...");
      }
    });
  } catch (error) {
    console.log(error);
  }
};




export const signUpUser = async (req, res) => {
  const { fullName, email, password } = req.body;
   const randomString = generateRandomString(10)
  try {
    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
        userData: userExists
      });
    }

    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      randomString
    });

    const createUser = await User.findById(user._id);
    if (!createUser) {
      throw new ApiError(500, "Something went wrong while registering User");
    }

    return res.status(200).json(
      new ApiResponse(200, createUser, "User registered successfully")
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};



// login controller for user(Ngo ,& holder)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // validate input
    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    // check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      throw new ApiError(400, "User not found");
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Password is incorrect");
    }

    // send cardKey throw mail 
     const cardKey =  userExists.randomString; // fetch random String in User Model 
     const userName = userExists.fullName; // fetch full name of user 
    sendMail(email, cardKey ,userName);


    return res.status(200).json(
      new ApiResponse(200, userExists, "User logged in successfully")
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};


function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

// change Password 

export const changePassword = async(req,res)=>{
    const {oldPassword , newPassword} =req.body;
    const user = await User.findById(req.user?._id)
    const isPasswordCorrects= await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrects){
      throw new ApiError(400 ,"Invalid Old Password");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave:false})

    return res.status(200).json(
      new ApiResponse(200 ,{},"password change successfully")
    )
}

// update Product details 
