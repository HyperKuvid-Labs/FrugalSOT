import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const connectDB = async () => {
  try {
    const mongo_uri = process.env.MONGODB_URI;

    if (!mongo_uri) {
      throw new Error("MongoDB URI is missing in .env file");
    }

    const conn = await mongoose.connect(mongo_uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Couldn't connect to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
