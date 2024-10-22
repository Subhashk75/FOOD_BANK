import Order from "../Models/NgoOrder.module.js";
import nodeMailer from "nodemailer";
import jwt from "jsonwebtoken";
import Holder from "../Models/StackHolder.module.js"; // Correct import
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Function to send email
const sendMail = async (email, holderemail, Postconfirm) => {
  try {
    let transportmail = nodeMailer.createTransport({
      service: "gmail",
      auth: {
         user: "kumawatsubhash388@gmail.com",
         pass: "joejkzhhckdphelr",  // Use environment variable
      },
    });

    let emailContent = {
      from: email,
      to: holderemail,
      subject: "Query mail",
      html: `<p>Please confirm user order to create post: ${Postconfirm}. Thanks for clicking.</p>`,
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

// Function to retrieve email from Holder schema
async function getEmailFromPostId(randomString) {
  try {
    const post = await Holder.findOne({ randomString }).populate('user', 'email'); // Use findOne instead of find for a single result
    if (post && post.user) {
      console.log(`User email: ${post.user.email}`);
      return post.user.email; // Return the email
    } else {
      console.log('Post not found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving post:', error);
    return null;
  }
}

// Create post function
export const acceptForm = async (req, res) => {
  const { fullName, personcount, email, phoneNo, district, address, pincode, randomString } = req.body;

  try {
    // Basic validation
    if (!fullName || !personcount || !phoneNo || !district || !address || !pincode || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const findEmail = await Order.findOne({ email });
    if (findEmail) {
      return res.status(409).json({ message: "Email already exists", findEmail });
    }

    // Get holder email from the random string
    // const holderemail = await getEmailFromPostId(randomString);

    // Insert data into the database
    const result = await Order.create({
      fullName,
      email,
      phoneNo,
      personcount,
      district,
      address,
      pincode,
    });

    console.log("User successfully created in MongoDB");

    // Create JWT
    const Postconfirm = jwt.sign(
      {
        _id: result._id,
        email: result.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    // Send confirmation email if holder email exists
    if (holderemail) {
      sendMail(email, holderemail, Postconfirm);
      
    }

    // Respond to the client
    res.status(201).json({ message: "Account created", token: Postconfirm });
  } catch (err) {
    console.log("Failed to create Post for stack Holder:", err);
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};

// Store this in environment variables for security!