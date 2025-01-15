import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
   
    isCheck: {
      type: Boolean,
      default: false, // Added default value
    },
    accessToken: {
      type: String,
    },
    refershToken: {
      type: String,
    },
    randomString: {
      type: String,
      required: true,
      unique: true,
    },
    product: [
      {
        foodName: {
          type: String,
        },
        mealType: {
          type: String,
          enum: ["Veg", "Non Veg"],
        },
        category: {
          type: String,
          enum: ["Row food", "Packaged food", "Cooked food"],
        },
        isConfirm: {
          type: Boolean, // Changed to camelCase
          default: false, // Added default value for unconfirmed entries
        },
        personcount: {
            type: Number,
            required: true,
          },
          phoneNo: {
            type: Number,
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
          randomString: {
            type: String,
          },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
