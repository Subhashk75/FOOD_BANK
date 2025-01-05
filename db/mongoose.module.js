import mongoose from "mongoose";
import dotenv from "dotenv";
import { MONGODB_NAME } from "../Constens.js";

// Load environment variables from .env file (adjust the path to reach the .env file correctly)
dotenv.config({ path: '../.env' });

const connectDB = async () => {
    try {
        // Check if MONGODB_URI exists and is correctly loaded
        // if (!process.env.MONGODB_URI) {
        //     console.log("hii");
        //     throw new Error("MONGODB_URI is not defined in the environment variables.");
        // }

        // Connect to MongoDB using the URI from environment variables
        const connectionInstance = await mongoose.connect("mongodb+srv://kumawatsubhash388:9huKp8IHnsdBRms8@cluster0.c83r5.mongodb.net", {
            dbName: MONGODB_NAME, // Optional: Set the database name
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // 30 seconds timeout
        });

    } catch (error) {
        console.error("inside Connection of Mongodb:", error);
        process.exit(1); // Exit the process with failure code
    }
};

// Listen for the connection event
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected');
});

export default connectDB;
