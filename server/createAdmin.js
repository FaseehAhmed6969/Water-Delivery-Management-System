const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

async function createAdmin() {
    try {
        let admin = await User.findOne({ email: 'faseehahmed39@gmail.com' });

        if (admin) {
            console.log('✅ Admin already exists!');
            console.log('Email: faseehahmed39@gmail.com');
            console.log('Password: Nigga1231234');
            console.log('Admin Key: i243009');
            process.exit();
        }

        admin = new User({
            name: 'Admin User',
            email: 'faseehahmed39@gmail.com',
            password: 'Nigga1231234',
            role: 'admin',
            phone: '0300-1234567',
            address: 'Admin Office'
        });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);

        await admin.save();
        console.log('✅ Admin created successfully!');
        console.log('Email: faseehahmed39@gmail.com');
        console.log('Password: Nigga1231234');
        console.log('Admin Key: i243009');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createAdmin();
