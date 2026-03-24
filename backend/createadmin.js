const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const bootstrapSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecell_db');
        console.log('Connected to MongoDB...');

        const email = 'superadmin@gmail.com';
        const password = 'admin@123'; // Change this immediately after first login

        const existing = await User.findOne({ email });
        if (existing) {
            console.log('Super Admin already exists.');
            process.exit(0);
        }

        await User.create({
            name: 'Faculty Incharge',
            email,
            password,
            role: 'super-admin'
        });

        console.log('✅ Super Admin created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating Super Admin:', err);
        process.exit(1);
    }
};

bootstrapSuperAdmin();
