const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({optionsSuccessStatus: 200}));
app.use(express.static('public'));

// CONNECT TO DB
mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const User = require('./models/User');

// ROUTES
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.get('/api/users/:_id/logs', async (req, res) => {
    let from = req.query.from;
    let to = req.query.to;
    let limit = req.query.limit;
    
    try {
        const user = await User.findById(req.params._id);
        if (from) {
            user.log = user.log.filter(obj => {
                let d1 = Date.parse(obj.date);
                let d2 = Date.parse(from);
                return d1 >= d2;
            });
        }

        if (to) {
            user.log = user.log.filter(obj => {
                let d1 = Date.parse(obj.date);
                let d2 = Date.parse(to);
                return d1 <= d2;
            });
        }
        if (limit) {
            user.log = user.log.slice(-parseInt(limit));
        }
        user.count = user.log.length;
        res.json(user);

    } catch (err) {
        res.json({message: err});
    }
});

app.post('/api/users', async (req, res) => {
    // Create new user
    const user = new User({
        username: req.body.username
    });
    try {
        const savedUser = await user.save();
        res.json({
            username: savedUser.username,
            _id: savedUser._id
        });
    } catch (err) {
        res.json({message: err});
    }
});

app.post('/api/users/:_id/exercises', async (req, res) => {
    try {
        const user = await User.findById(req.params._id);
        let date = req.body.date.split('-');
        date = new Date(date[0], date[1]-1, date[2]).toDateString();
        user.log.push({
            description: req.body.description,
            duration: req.body.duration,
            date: date
        });
        user.count = user.log.length;
        const savedUser = await user.save();
        res.json({
            username: savedUser.username,
            description: req.body.description,
            duration: Number(req.body.duration),
            date: date,
            _id: user._id
        });
    } catch (err) {
        res.json({message: err});
    }
});

app.listen((process.env.PORT || 5000), () => {
    console.log('App is listening...');
});