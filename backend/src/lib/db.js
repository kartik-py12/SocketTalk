import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected succeffuly : ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connnection error: ${error.message}`);
    }
}