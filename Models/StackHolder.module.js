import mongoose from "mongoose";
const holderSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: true,
    },
    mealType: {
      type: String,
      required: true,
      enum: ["Veg", "Non Veg"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Raw food", "Packaged food", "Cooked food"],
    },
    personcount: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNo: {
      type: String, // Phone number as string
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    randomString: {
      type:String
    },
  },
  { timestamps: true }
);

const Holder = mongoose.model("Holder", holderSchema);

export default Holder;
