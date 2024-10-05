import mongoose from "mongoose";

const holderSchema = new mongoose.Schema(
    {
      foodName:{
        type:String,
        required:true
      },
      mealType:{
        type:String,
        required:true,
        enum :["Veg","Non Veg"]
      },
      category:{
        type:String,
        required:true,
        enum:["Row food","Packaged food" ,"Cooked food"]
      },
      quantity:{
        type:Number,
        required:true,

      },
      email:{
        type:String,
        required:false,
        unique:false,

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
      randomString:{
           type:String,
           required:true
      },
      isconfirm:{
        type:Boolean
      },
      isCheck:{
        type:Boolean,
        default:false
      },
      // user: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'User', // Reference to the User model
      //   required: true, // This can be optional depending on your use case
      // }

    },
    {timestamps:true})


   const Holder =mongoose.model("Holder",holderSchema);

   export default Holder