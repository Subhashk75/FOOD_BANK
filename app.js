import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import holderRoute from "./Routes/StackHolder.Routes.js"
import NgoOrderRoute from "./Routes/NgoOrder.Routes.js"
import userRoute from "./Routes/User.Routes.js"
const app =express();
import path from "path"
app.use(cors());

app.use(cookieParser())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"26kb"}))

const _dirname = path.resolve();
app.use("/api/v1" , holderRoute);
app.use("/api/v2" , NgoOrderRoute);
app.use("/api/v3" ,userRoute);

app.use(express.static(path.join(_dirname,"/Food_bank/dist")))

app.get('*' ,(req,res)=>{
    res.sendFile(path.resolve(_dirname,"Food_bank" ,"dist" ,"index.html"));
})
export {app}