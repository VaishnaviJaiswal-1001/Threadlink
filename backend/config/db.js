const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async (retries = 5) => {
  let uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<user>')) {
    logger.warn('No valid MONGO_URI provided. Starting an in-memory MongoDB instance for local development...');
    const mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  }

  while (retries) {
    try {
      const conn = await mongoose.connect(uri);
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      break;
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      retries -= 1;
      logger.info(`Retries left: ${retries}`);
      if (retries === 0) {
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;
