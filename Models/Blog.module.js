import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxlength: [100, "Title can't be more than 100 characters"],
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        minlength: [50, "Content should be at least 50 characters long"],
    },
    image: {
        type: String,
        default: null, // Allows the image to be optional
    },
    author: {
        type: String,
        required: [true, "Author name is required"],
    },
}, { timestamps: true });

export const Blog = mongoose.model("Blog", blogSchema)