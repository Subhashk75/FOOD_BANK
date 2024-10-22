import User from "../Models/User.module.js";
import { ApiError } from "../utitles/ApiError.utitles.js";
import { ApiResponse } from "../utitles/ApiResponse.utitles.js";
import bcrypt from "bcrypt"
export const signUpUser = async (req,res)=>{
    const {fullName ,email ,password} = req.body;
    // check if user already exist or not 
    const userExits = await User.findOne(email);
    if(userExits){
        res.status(200).json({
            success:false,
            message:"user already exit ",
            userData : userExits
        })
    }
    // user model entries filling 
    const user = await User.create({
        fullName,
        email,
        password
      });

      const createUser = await User.findById(user._id);
      if(!createUser){
        throw new ApiError(500 ,"Something went wrong while registering User ")
      }
     
      return res.status(200).json(
        new ApiResponse(200 ,createUser ,"User resgister successfully")
      )
} 

export const loginUser = async (req,res)=>{
    // fetch login user  detail 
    const {email ,password} =req.body;

    // validation
    if(email ==="" && password===""){
        throw new ApiError (400 ," required all field")
    }
    
    // check existUser or not ,

     const userExit = User.findOne({email:email})
     if(!userExit){
        throw new ApiError(400 ," user not Exits in Model ");
     }
    //password validation
     
    const isPasswordCorrect = await bcrypt.compare(password , userExit.password);

    if(!isPasswordCorrect){
        throw new ApiError(400 ,"password is not correct ")
    }


    return res.status(201).json(
        new ApiResponse({
           status :200,
           message:"user logged in successfully ",
           data :userExit
        }
     )
    )  

}
