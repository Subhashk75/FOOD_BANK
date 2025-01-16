import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import holderRoute from "./Routes/StackHolder.Routes.js";
import NgoOrderRoute from "./Routes/NgoOrder.Routes.js";
import userRoute from "./Routes/User.Routes.js";
import connectDB from "./db/mongoose.module.js";

// Load environment variables
dotenv.config({ path: '../.env' }); // Adjust path to locate .env outside the backend folder

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();
app.use(cors());
// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));
  

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "26kb", extended: true }));

// Serve routes
app.use("/api/v1", holderRoute);
app.use("/api/v2", NgoOrderRoute);
app.use("/api/v3", userRoute);

// Serve static files from the dist folder
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/Food_bank/dist")));

// Serve index.html for all unmatched routes (for SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, "Food_bank", "dist", "index.html"));
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
