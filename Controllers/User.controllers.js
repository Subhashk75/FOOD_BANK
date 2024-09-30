import User from "../Models/User.module.js";
import nodeMailer from "nodemailer";
import jwt from "jsonwebtoken";
import Holder from "../Models/StackHolder.module.js"; // Correct import

// Function to send email
const sendMail = async (email, holderemail, Postconfirm) => {
  try {
    let transportmail = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "kumawatsubhash388@gmail.com",
        pass: "joejkzhhckdphelr", // Store this in environment variables for security!
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
async function getEmailFromPostId(id) {
  try {
    const post = await Holder.findById(id).populate('user', 'email'); // Assumes Holder has a reference to a 'user' model
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
  const { fullName, personcount, email, phoneNo, district, address, pincode } = req.body;

  try {
    // Basic validation
    if (!fullName || !personcount  || !phoneNo || !district || !address || !pincode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert data into the database
    const result = await User.insertMany({
      fullName,
      email,
      phoneNo,
      personcount,
    //   id: Holder._id, // Assuming this is correct, if not replace with relevant field
      district,
      address,
      pincode,
    });

    console.log("Mongoose DB create");

    // Create JWT
    const Postconfirm = jwt.sign(
      {
        _id: result[0]._id, // Using the first document's ID
        email: result[0].email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    // Get the email of the holder by ID
    // const holderemail = await getEmailFromPostId(id);

    // // Send confirmation email if holder email exists
    // if (holderemail) {
    //   sendMail(email, holderemail, Postconfirm);
    // }

    // Respond to the client
    res.status(201).json({ message: "Account created", token: Postconfirm });
  } catch (err) {
    console.log("Failed to create Post for stack Holder:", err);
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};
