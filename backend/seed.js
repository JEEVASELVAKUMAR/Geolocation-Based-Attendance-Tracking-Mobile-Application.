const User = require('./models/User');
const Organization = require('./models/Organization');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-geo-attendance');
        
        // 1. Create a dummy organization first
        let org = await Organization.findOne({ name: 'Default Org' });
        if (!org) {
            org = await Organization.create({
                name: 'Default Org',
                location: { latitude: 12.9716, longitude: 77.5946 }, // Bangalore
                geofenceRadius: 500
            });
            console.log('Created Default Org');
        }

        // 2. Create Admin
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            await User.create({
                name: 'Head Admin',
                email: 'admin@system.com',
                password: 'adminpassword123', // Will be hashed by pre-save hook
                staffId: 'ADMIN001',
                department: 'Management',
                organization: org._id,
                role: 'admin'
            });
            console.log('Created Admin User: admin@system.com / adminpassword123');
        } else {
            console.log('Admin user already exists');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
