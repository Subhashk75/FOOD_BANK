import mongoose from "mongoose"
import jwt from "jsonwebtoken"
const orderSchema = new mongoose.Schema(
    {
       fullName :{
        type:String,
        required: true,
        trim:true
       },
       email:{
        type:String,
        required:true,
        unique:true,
        lowecase:true
       },
       personcount:{
        type:Number,
        required:true
       },
       phoneNo:{
        type:Number,
        required:true
       },
       district:{
        type:String,
        required:true
       },
       address:{
        type:String,
        required:true
       },
       pincode:{
        type:Number,
        required:true
       },
       isCheck:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Holder"
       },
       holder: { type: mongoose.Schema.Types.ObjectId, ref: 'Holder' }, // Reference to Holder

      
    }
    ,{timestamps:true})
  
    orderSchema.methods.generateAccessToken= function(){
        return jwt.sign({
            _id:this._id,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
           expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
        
    )
    }

    orderSchema.methods.generateRefreshToken= function(){
        return jwt.sign({
            _id:this._id,
            email:this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
           expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
        
    )
    }

const Order =mongoose.model("Order" ,orderSchema);

export default Order