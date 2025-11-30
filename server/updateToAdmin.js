const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

async function updateToAdmin() {
    try {
        const user = await User.findOne({ email: 'faseehahmed39@gmail.com' });

        if (!user) {
            console.log('❌ User not found with that email');
            process.exit();
        }

        console.log(`Current role: ${user.role}`);

        user.role = 'admin';
        await user.save();

        console.log('✅ User role updated to ADMIN!');
        console.log('Email: faseehahmed39@gmail.com');
        console.log('Password: Nigga1231234');
        console.log('Admin Key: i243009');
        console.log('Role:', user.role);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateToAdmin();
