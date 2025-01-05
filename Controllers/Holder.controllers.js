import nodeMailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../Models/User.module.js";
import Holder from "../Models/StackHolder.module.js";
// Send confirmation email function
const sendMail = async (email, Postconfirm) => {
  try {
    let transportmail = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "kumawatsubhash388@gmail.com",
        pass: "joejkzhhckdphelr", // Replace with env variable for security
      },
    });

    let emailContent = {
      from: email,
      to: "kumawatsubhash388@gmail.com",
      subject: "For query mail",
      html: `<p>Please confirm the user's order to create the post: ${Postconfirm}, thank you for your action.</p>`,
    };

    transportmail.sendMail(emailContent, function (err, val) {
      if (err) {
        console.log(err);
      } else {
        console.log(val.response, "Mail sent.");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Create post function
// Create post function
export const createPost = async (req, res) => {
  console.log("Request body:", req.body); // Log request body for debugging
  
  const { foodName, mealType, category, personcount, phoneNo, district, address, pincode, randomString ,email} = req.body;

  try {
    // Validate required fields
    if (!foodName || !mealType || !category || !personcount || !phoneNo || !district || !address || !pincode || !randomString||!email ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user using randomString
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
      
    }

    // Add the new product to the user's product array
    const newProduct = { foodName, mealType, category, personcount, phoneNo, district, address, pincode };
     
     user.product.push(newProduct);
     // add new field in holder collection 
     await Holder.create({
      foodName, mealType, category, personcount, phoneNo, district, address, pincode, randomString 
    });
    // Save the updated user document
    const updatedUser = await user.save();

    // Generate JWT for confirmation
    const Postconfirm = jwt.sign(
      { _id: updatedUser._id, email: updatedUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    // Send confirmation email
    // sendMail(email, Postconfirm);

    // Respond with success
    res.status(201).json({ message: "Product added successfully", data: updatedUser });
  } catch (err) {
    console.log("Failed to create post for Stack Holder:", err);
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};

 
export const postResponse = async(req,res)=>{
         
  try {
    // Fetch all documents in the collection
    const postResponseData = await Holder.find({});

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 4); // 4 days from now

    // Serialize the array of blog posts to JSON
    const serializedBlogs = JSON.stringify(postResponseData);

    // Set cookie with serialized blogs
    res.cookie('postData', encodeURIComponent(serializedBlogs), {
      maxAge: 24 * 60 * 60 * 1000 * 4, // 4 days in milliseconds
      httpOnly: false
    });

    res.status(200).json(postResponseData);
} catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
}

} 



// Generate random string function
// function generateRandomString(length = 7) {
//   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
//   let result = "";

//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }

//   return result;
// }
