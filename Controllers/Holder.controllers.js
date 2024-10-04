import  Holder  from "../Models/StackHolder.module.js"
import nodeMailer from "nodemailer"
import jwt from "jsonwebtoken"
const sendMail=async(email,Postconfirm)=>{
    try {
      let transportmail = nodeMailer.createTransport({
          service:"gmail",
          auth:{
            user:"kumawatsubhash388@gmail.com",
            pass:"joejkzhhckdphelr"
          }
        })
        let emailContent ={
          from:email,
          to:"kumawatsubhash388@gmail.com",
          subject:"for query mail",
          // text:"this is my first application"
          html:'<p> plase confirm user Order to create Post'+ Postconfirm+', thank for user click </p>'
        }
        
        transportmail.sendMail(emailContent ,function(err, val){
          if(err){
            console.log(err);
        
          }else{
            console.log(val.response ,"sent mail .....");
          }
        })
  
  
   } catch (error) {
      console.log(error);
   }
  }

  
  export const createPost = async (req, res) => {
      const { foodName, mealType, category, quantity, email, phoneNo, district, address, pincode ,id } = req.body;
         
     
      try {
          // Basic validation
          const holder = await Holder.findById(id);
          if (!holder) {
            
          }


          if (!foodName || !mealType || !category || !quantity || !phoneNo || !district || !address || !pincode) {
              return res.status(400).json({ message: "All fields are required" });
          }
  
          // Insert data into the database
          const result = await Holder.insertMany({
              foodName,
              email,
              phoneNo,
              mealType,
              category,
              quantity,
              district,
              address,
              pincode
          });
  
          console.log("Mongoose DB create");
  
          // Create JWT
          const Postconfirm = jwt.sign(
              {
                  _id: result[0]._id, // Using the first document's ID
                  email: result[0].email
              },
              process.env.ACCESS_TOKEN_SECRET,
              {
                  expiresIn: process.env.ACCESS_TOKEN_EXPIRY
              }
          );
  
          // Send confirmation email
          if(email){
          sendMail(email, Postconfirm);
          }
          // Respond to client
          res.status(201).json({ message: "Account created", data:result});
          
      } catch (err) {
          console.log("Failed to create Post for stack Holder:", err);
          res.status(500).json({ message: "Failed to create post", error: err.message });
      }
  };
  
  export const postResponse = async(req,res)=>{
         
    try {
      // Fetch all documents in the collection
      const data = await Holder.find({});
      // Send the data as JSON response
      res.status(200).json(data);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
  }

  } 
 