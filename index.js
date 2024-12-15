const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8000;
const cors = require('cors');
const fs = require('fs');

app.use(cors());



// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/tester')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    email: String,
    gender: String
});

const User = mongoose.model('recipes', userSchema);

// middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// middleware for making log file 
app.use((req, res, next) => {
    if (req.method === 'GET' && req.path === '/api/users') {
        fs.appendFile('log.txt', `${req.method} ${req.url} ${new Date().toISOString()}\n`, (err) => {
            if (err) {
                console.error('Failed to write to log file', err);
            }
        });
    }
    next();
});






// app.use((req,res,next)=>{
//     if (req.query.isadmin){
//         next()
//     }else{
//         res.status(401).json({status:'error',message:'Unauthorized'})
//     }
// })


// cookies
app.get('/setname',(req,res)=>{
     res.cookie('name',req.query.name)
     res.send('cookie set')
})

// routes
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.json({ status: 'success', data: users }); // Send users in JSON format
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
app.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        const html = `
        <ul>
            ${users.map(user => `<li>${user.first_name} ${user.last_name} - ${user.email}</li>`).join('')}
        </ul>
        `;
        res.send(html);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app
    .route("/api/user/:id")
    .get(async (req, res) => {
        try {
            const userId = Number(req.params.id);
            const user = await User.findOne({ id: userId });
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
            res.json({ status: 'success', data: user });
        } catch (err) {
            res.status(500).json({ status: 'error', message: err.message });
        }
    })
    .patch(async (req, res) => {
        try {
            const userId = Number(req.params.id);
            const user = await User.findOneAndUpdate(
                { id: userId },
                req.body,
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
            res.json({ status: 'success', data: user });
        } catch (err) {
            res.status(500).json({ status: 'error', message: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const userId = Number(req.params.id);
            const user = await User.findOneAndDelete({ id: userId });
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
            res.json({ status: 'success', message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ status: 'error', message: err.message });
        }
    });

// Create new user
app.post('/api/user', async (req, res) => {
    try {
        // Find the highest existing id
        const maxUser = await User.findOne().sort({ id: -1 });
        const nextId = (maxUser?.id || 0) + 1;

        const newUser = new User({
            ...req.body,
            id: nextId
        });
        await newUser.save();
        res.json({ status: 'success', data: newUser });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Search endpoint to fetch all users
app.get('/search', async (req, res) => {
    try {
        const { query = '' } = req.query; // Only keep the query parameter
        
        const searchQuery = {
            $or: [
                { first_name: { $regex: query, $options: 'i' } },
                { last_name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                ...((!isNaN(query) && query !== '') ? [{ id: Number(query) }] : [])
            ]
        };

        const users = await User.find(searchQuery).sort({ id: 1 }); // Fetch all matching users

        res.json({
            status: 'success',
            data: users
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

