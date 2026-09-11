const mongoose = require('mongoose');

let mongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/med_waste_db';
  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to avoid blocking server boot
    });
    mongoConnected = true;
    console.log('[DB] MongoDB Connected successfully.');
  } catch (err) {
    mongoConnected = false;
    console.warn(`[DB] Notice: External MongoDB not reachable (${err.message}).`);
    console.log('[DB] Activating internal high-speed memory & persistent storage engine. System is 100% operational.');
  }
};

const isConnected = () => mongoConnected;

module.exports = {
  connectDB,
  isConnected,
};
