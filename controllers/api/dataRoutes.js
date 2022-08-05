export { router };

import express from 'express';
import { User, UserStats } from '../../models/index.js';

const router = express.Router();

// Gets the Herble by number
// OUTPUT
// {
//     img_url: string,
//     name: string
// }
router.get('/herble/:num', async (req, res) => {
    try {
        
    } catch (err) {
        
    }
});

// Handles success/failure
// Calculate and updates streak in the sql db
// INPUT
// {
//     uuid: uuid,
//     number: number,
//     success: bool,
// }
router.post('/herble', async (req, res) => {
    try {
        
    } catch (err) {
        
    }
});

// Handles every guess for stats/analytics
// Stores in another data store
// INPUT
// {
//     uuid: uuid,
//     number: number,
//     guessNum: number,
//     guess: string,
// }
router.post('/herble/data', async (req, res) => {
    try {
        
    } catch (err) {
        
    }
});

// Handles user creation
// INPUT
// {
//     username:,
//     password:,
//     email:,
// }
router.post('/users', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        // not sure if this code works
        const stats = await UserStats.create({ streak: 0, highestStreak: 0, lastCompleted: null });
        userData.setUserStats(stats);

        res.status(200).json(userData);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

// Returns data about a user
// Data stored in profile
// User name, current streak, highest streak, last solved
// OUTPUT
// {
//     id: number,
//     username: string,
//     email?: string,
//     stats: {
//         streak: number,
//         higheststreak: number,
//         lastCompleted: number
//     }
// }
router.get('/users/:id', async (req, res) => {
    try {
        // OPTIONAL TO DO
        // Check the cookie and only send back email if the account is the user's
        const user = await User.findOne({
            where: {
                id: req.params.id
            },
            attributes: {
                exclude: ['email', 'password']
            },
            include: {
                model: UserStats,
                attributes: ['streak', 'highestStreak', 'lastCompleted']
            }
        });

        if (!user) {
            res.status(400).json({ message: 'Incorrect user id'});
            return;
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});
