const mongoose = require('mongoose');
require('dotenv').config();
const TeamMember = require('./models/TeamMember');

async function testSaveFetch() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // 1. Create a test alumni
        const testAlum = await TeamMember.create({
            name: "Test Alum",
            role: "Software Engineer",
            category: "Alumni",
            company: "Test Co",
            formerPosition: "Lead Developer",
            email: "test@example.com"
        });
        
        console.log("Created:", testAlum.formerPosition);
        
        // 2. Fetch it back
        const fetched = await TeamMember.findById(testAlum._id);
        console.log("Fetched:", fetched.formerPosition);
        
        // 3. Clean up
        await TeamMember.findByIdAndDelete(testAlum._id);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testSaveFetch();
