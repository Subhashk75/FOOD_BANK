// Create post function
import User from "../Models/User.module.js"
import Holder from "../Models/StackHolder.module.js"
import { ApiError } from "../utitles/ApiError.utitles.js";
import nodeMailer from "nodemailer"
// import { ApiResponse } from "../utitles/ApiResponse.utitles.js";
export const acceptForm = async (req, res) => {
  const { fullName, personcount, phoneNo, district, address, pincode, randomString, email } = req.body;
    console.log(randomString)
  try {
    // Basic validation
    if (!fullName || !personcount || !phoneNo || !district || !address || !pincode || !randomString || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check Ngo authentication
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, "Invalid email & Random/Card Key");
    }
     
      // Check if the randomString already exists in the user's product
      const userRandomStringExists = user.product.some(product => product.randomString === randomString);
      console.log(userRandomStringExists)
      if (userRandomStringExists) {
        return res.status(200).json({ message: "Order already confirmed for this randomString" });
      }
    // Add new product
    const newProduct = { personcount, phoneNo, district, address, pincode,randomString };

    user.product.push(newProduct);
    const updatedUser = await user.save();
    // console.log(updatedUser);
    // Retrieve the holder's email using randomString
    const holder = await User.findOne({ randomString });
    if (!holder) {
      throw new ApiError(404, "Holder not found");
    }
  
    const holderEmail = holder.email;

    // Send acknowledgment email to holder
    await sendMail(email, holderEmail);

    // Respond to the client
    res.status(201).json({ message: "Account created and holder notified" });
  } catch (err) {
    console.log("Failed to create Post for stack Holder:", err);
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};

// Function to send email
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


// Function to retrieve email from Holder schema using randomString
async function getEmailFromPostId(randomString) {
  try {
    const post = await Holder.findOne({ randomString }).populate('user', 'email');
    if (post && post.user) {
      return post.user.email;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving post:', error);
    return null;
  }
}




 // Create JWT
    // const Postconfirm = jwt.sign(
    //   {
    //     _id: result._id,
    //     email: result.email,
    //   },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    // );







// Insert data into the database
    // const result = await Order.create({
    //   fullName,
    //   email,
    //   phoneNo,
    //   personcount,
    //   district,
    //   address,
    //   pincode,
    //   randomString
    // });