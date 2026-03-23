const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecell_db';
        const conn = await mongoose.connect(uri);
        const dbName = conn.connection.name;
        
        logger.info(`✅ Successfully connected to MongoDB database: ${dbName}`);
        
        // Fetch and log all existing collections/tables
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        if (collectionNames.length === 0) {
            logger.warn(`⚠️ Database '${dbName}' is connected, but no tables (collections) are present. They will be created automatically upon data insertion.`);
        } else {
            logger.info(`📊 Database tables verified successfully: [${collectionNames.join(', ')}]`);
        }
        
    } catch (error) {
        logger.error(`❌ Failed to connect to MongoDB database: ${error.message}`);
        console.error('❌ Failed to connect to MongoDB:');
        console.error(error.message);
        console.error('Make sure your local MongoDB server is running or your Atlas URI is correct.');
        process.exit(1);
    }
};

module.exports = connectDB;
