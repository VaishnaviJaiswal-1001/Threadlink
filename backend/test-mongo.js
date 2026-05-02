const mongoose = require('mongoose');

const uri = 'mongodb+srv://hnerq46828_db_user:Lu123@cluster0.f7egciq.mongodb.net/threadlink?appName=Cluster0';

console.log('Attempting to connect to MongoDB...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILED: Could not connect to MongoDB Atlas.');
    console.error(err.message);
    process.exit(1);
  });
