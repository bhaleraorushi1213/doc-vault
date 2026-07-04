import mongoose from 'mongoose';
// this is where we have connected our database

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
   }
   catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  } 
};