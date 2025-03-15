import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbName = process.env.DB_NAME || "";
    if (!dbName) {
      throw new Error("Database name is missing");
    }
    const mongo_uri = process.env.MONGO_URI || "";
    if (!mongo_uri) {
      throw new Error("Mongo URI is missing");
    }

    await mongoose.connect(mongo_uri);

    console.log("MongoDB connected");
  } catch (err) {
    console.error("Couldn't connect to MongoDB", err);
    process.exit(1);
  }
};

export default connectDB;
