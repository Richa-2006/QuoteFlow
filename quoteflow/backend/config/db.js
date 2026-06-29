const mongoose = require('mongoose');

const connectDB = async () => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000, // 10s timeout per attempt
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return; // success — exit the function
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  console.error('All MongoDB connection attempts failed.');
  console.error('Tip: Make sure your IP is whitelisted in MongoDB Atlas (Network Access → Add Current IP).');
  process.exit(1);
};

module.exports = connectDB;
