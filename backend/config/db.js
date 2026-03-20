const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecell_db';
        await mongoose.connect(uri);
        console.log('✅ Successfully connected to MongoDB.');
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:');
        console.error(error.message);
        console.error('Make sure your local MongoDB server is running or your Atlas URI is correct.');
        process.exit(1);
    }
};

module.exports = connectDB;
