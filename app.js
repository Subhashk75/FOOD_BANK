import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import holderRoute from "./Routes/StackHolder.Routes.js"
import NgoOrderRoute from "./Routes/NgoOrder.Routes.js"
import userRoute from "./Routes/User.Routes.js"
const app =express();

app.use(cors());

app.use(cookieParser())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"26kb"}))

app.use("/api/v1" , holderRoute);
app.use("/api/v2" , NgoOrderRoute);
app.use("/api/v3" ,userRoute);



export {app}