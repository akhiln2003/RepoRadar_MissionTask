import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGODB_URI;
  if (!MONGO_URI) throw new Error("MONGODB_URI must be defined");

  try {
    await mongoose.connect(`${MONGO_URI}/github_search_app`);
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error: any) {
    console.error("Error during disconnect:", error);
  }
};

export { connectDB, disconnectDB };
