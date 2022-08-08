export { router };

import express from 'express';
import { STRING } from 'sequelize';
import { Guess, Herble, User, UserStats } from '../../models/index.js';
import { Plant } from '../../models/Plant.js';

const router = express.Router();

// Gets the Herble by number
// OUTPUT
// {
//     img_url: string,
//     name: string
// }
router.get('/herble/:num', async (req, res) => {
    try {
      const picture = await Plant.findOne({
        where: {
          id: req.params.num
        }
        
      });
        res.status(200).json(picture);
    } catch (err) {
      res.status(500).json(err);
    }
});

// Handles success/failure
// Calculate and updates streak in the sql db
// INPUT
// {
//     number: number,
//     success: bool,
// }
router.post('/herble', async (req, res) => {
    try {
        const stats = await UserStats.findOne({
            // The following line is the line we probably want in the final version
            // where: { userId: req.session.user_id }

            // This is just for testing purposes
            where: { userId: req.body.id }
        });

        if (!stats) {
            res.status(400).json({ message: 'No user found with this id'});
            return;
        }

        stats.gamesPlayed++;
        if (req.body.success) {
            stats.gamesSolved++;
            // If none have been solved before
            if (!stats.lastSolved) {
                stats.lastSolved = req.body.number;
                stats.streak = 1;
            } else {
                // If the number just solved is one after the previously solved
                if (req.body.number == stats.lastSolved + 1) {
                    stats.streak++;
                } else {
                    stats.streak = 0;
                }
                stats.lastSolved = req.body.number;
            }
            stats.highestStreak = Math.max(stats.streak, stats.highestStreak);
        } else {
            stats.streak = 0;
        }

        await stats.save();
        res.status(200).json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Handles every guess for stats/analytics
// Stores in another data store
// INPUT
// {
//     herbleNum: number,
//     guessNum: number,
//     guess: string,
// }
// UPDATE USER STATS MODEL
router.post('/herble/data', async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await User.findByPk(req.sessionID.user_id);

        if (!user) {
            res.status(400).json({ message: 'No user found with this id'});
        }

        const herble = await Herble.findOne({ where: { number: req.params.herbleNum } });

        if (!herble) {
            res.status(400).json({ message: 'No herble found with this number'});
        }

        const guess = await Guess.create({ guessNumber: req.params.guessNum, guess: req.params.guess })
        guess.setUser(user);
        guess.setHerble(herble);

        res.status(200);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
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
        const stats = await UserStats.create({ streak: 0, highestStreak: 0, gamesPlayed: 0, gamesSolved: 0, lastSolved: null });
        userData.setUserStats(stats);

        res.status(200).json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
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
                attributes: {
                    exclude: ['id', 'userId']
                }
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

// [
//     {
//         common_name: STRING,
//         scientific_name: STRING
//     },
//     ...
// ]
router.get('/plants', async (req, res) => {
    try {
        const plants = await Plant.findAll({
            where: {
                url: null
            }
        });

        return res.status(200).json(plants);
    } catch (err) {
        res.status(500).json(err);
    }
});