import { Blog } from "../Models/Blog.module.js";
import { ApiError } from "../utitles/ApiError.utitles.js";
import { uploadOnCloudinary } from "../utitles/cloudinary.utitles.js";

// Create a new blog post
const BlogPost = async (req, res, next) => {
  try {
    const { title, content, author } = req.body;

    // Validation check for required fields
    if (!title || !content || !author) {
      throw new ApiError(400, "All fields are required.");
    }

    const postLocalPath = req.files?.image?.[0]?.path;

    if (!postLocalPath) {
      throw new ApiError(400, "Image path is empty.");
    }

    // Upload the image to Cloudinary
    const imagePath = await uploadOnCloudinary(postLocalPath);

    if (!imagePath || !imagePath.url) {
      throw new ApiError(400, "Failed to upload image to Cloudinary.");
    }

    // Create a new blog post in MongoDB
    const createBlogPost = await Blog.create({
      title,
      content,
      author,
      image: imagePath.url,
    });

    return res.status(201).json({
      success: true,
      message: "Blog post created successfully!",
      data: createBlogPost,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch and send blog data with cookie
const blogData = async (req, res) => {
  try {
    const blogResponseData = await Blog.find({});

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 4); // 4 days from now

    // Serialize the array of blog posts to JSON
    const serializedBlogs = JSON.stringify(blogResponseData);

    // Set cookie with serialized blogs
    res.cookie('blogData', encodeURIComponent(serializedBlogs), {
      maxAge: 24 * 60 * 60 * 1000 * 4, // 4 days in milliseconds
      httpOnly: false
    });

    res.status(200).json(blogResponseData);
  } catch (error) {
    console.error('Error fetching blog data:', error);
    res.status(500).json({ error: 'Failed to fetch blog data' });
  }
};

export { BlogPost, blogData };
