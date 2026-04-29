const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Update all users who don't have isProfileComplete field to true
    const result = await User.updateMany(
      { isProfileComplete: { $exists: false } },
      { $set: { isProfileComplete: true } }
    );
    
    console.log(`Updated ${result.modifiedCount} existing users.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
