import mongoose from "mongoose"
import { MONGODB_NAME } from "../Constens.js"

const connectDB = async()=>{
    try {
     const connectionInstance=   await mongoose.connect(`${process.env.MONGODB_URI}/${MONGODB_NAME}` ,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
     });
     console.log(connectionInstance.connection.host);
    } catch (error) {
        console.log("inside Connection of Mongodb :" ,error);
    }
}

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected');
});
export default connectDB