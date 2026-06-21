require('dotenv').config();
const mongoose = require('mongoose');

async function clearDatabase() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected.');

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      console.log(`Dropping collection: ${collection.collectionName}`);
      await collection.drop();
    }

    console.log('Successfully dropped all collections.');
  } catch (err) {
    console.error('Error clearing database:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

clearDatabase();
