import express from "express";
import { createPost, postResponse } from "../Controllers/Holder.controllers.js";
const router= express.Router();

router.post("/createPost" ,createPost);

router.get("/postData" ,postResponse)
export default router;