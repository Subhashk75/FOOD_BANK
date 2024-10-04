import { Blog } from "../Models/Blog.module.js";
import { ApiError } from "../utitles/ApiError.utitles.js";
import { uploadOnCloudinary } from "../utitles/cloudinary.utitles.js";

const BlogPost = async (req, res, next) => {
  try {
    // Destructure data from the frontend request
    const { title,content,author} = req.body;
    // object destrutcion 

    // Validation check for required fields
    if (!title || !content || !author) {
      throw new ApiError(400, "All fields are required.");
    }

    // Fetch the local image path from the request (assuming multer is used)
    const postLocalPath = req.files?.image?.[0]?.path;

    // Check if the image path is present
    if (!postLocalPath) {
      throw new ApiError(400, "Image path is empty.");
    }

    // Upload the image to Cloudinary
    const imagePath = await uploadOnCloudinary(postLocalPath);

    // Validate the Cloudinary upload result
    if (!imagePath || !imagePath.url) {
      throw new ApiError(400, "Failed to upload image to Cloudinary.");
    }

    // Create a new blog post in MongoDB
    const createBlogPost = await Blog.create({
      title,
      content,
      author,
      image: imagePath.url,  // Store the Cloudinary image URL
    });

    // Respond with the created blog post
    return res.status(201).json({
      success: true,
      message: "Blog post created successfully!",
      data: createBlogPost,
    });

  } catch (error) {
    // Pass any errors to the next middleware (like an error handler)
    next(error);
  }
};

const blogData =async(req,res)=>{
   try {
    const BlogResponseData = await Blog.find({});
     
    res.status(200).json(BlogResponseData);
   } catch (error) {
    console.error('Error fetching data Blog :', error);
    res.status(500).json({ error: 'Failed to fetch data Blog ' });
   }

}




export { BlogPost ,blogData };
