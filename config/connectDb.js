import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `Connection successfully established with the database. Host: ${connection.host}`
    );
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
  }
};
