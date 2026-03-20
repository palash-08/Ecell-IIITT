const mongoose = require('mongoose');
require('dotenv').config();
const TeamMember = require('./models/TeamMember');

async function checkTeam() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const members = await TeamMember.find({ category: 'Alumni' });
        console.log(JSON.stringify(members, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTeam();
