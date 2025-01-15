import express from "express";
import { acceptForm } from "../Controllers/NgoOrder.controllers.js";
import { blogData, BlogPost } from "../Controllers/Blog.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// Route to accept the form (for user or other purposes)
router.post("/acceptForm", acceptForm);

// Route to create a blog post with an image upload
router.route("/blogs").post(
  // This middleware will handle file uploads (image in this case)
  upload.fields([{ name: "image", maxCount: 1 }])  ,
  BlogPost // The handler for creating the blog post
);

router.route("/BlogData" ).get(blogData);
export default router;
