import express from "express"
import {loginUser ,signUpUser } from "../Controllers/User.controller.js"

const router= express.Router();

router.post("/signup",signUpUser);
router.route("/login").post(loginUser)

export default router;