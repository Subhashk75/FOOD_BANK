import express from "express";
import { createPost } from "../Controllers/Holder.controllers.js";
const router= express.Router();

router.post("/createPost" ,createPost);

export default router;