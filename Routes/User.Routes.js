import express from "express";
import { acceptForm } from "../Controllers/User.controllers.js";
const router= express.Router();

router.post("/acceptForm" ,acceptForm);

export default router;