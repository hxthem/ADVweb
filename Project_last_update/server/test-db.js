require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI.split('@')[1] || 'URL hidden');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connection Successful!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\nDatabase Name:', mongoose.connection.name);
    console.log('Collections in database:');
    if (collections.length === 0) {
      console.log('- (No collections found yet. Database is empty)');
    } else {
      collections.forEach(c => console.log(`- ${c.name}`));
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Connection Failed:');
    console.error(err.message);
    process.exit(1);
  }
}

testConnection();
