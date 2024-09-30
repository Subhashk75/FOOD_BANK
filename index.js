import dotenv from "dotenv"
import express from "express"
import { app } from "./app.js";
 dotenv.config({
    path:'./env'
 })
import connectDB from "./db/mongoose.module.js";

connectDB();

const port= process.env.PORT||3000;

app.listen(port ,()=>{
    console.log(`server is running at http://localhost:${port}`);
});