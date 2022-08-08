import plantData from './plantData.json' assert {type: 'json'};
import { Guess, Herble, User, UserStats } from '../../models/index.js';

import { sequelize } from '../../config/connection.js';

const userData = [
    {
        username: 'kurt',
        email: 'kurt@bixby.com',
        password: 'password',
    },
    {
        username: 'jeffrey',
        email: 'jeffrey@bixby.com',
        password: 'password',
    }
];

const herbleData = [];
for (var i = 1; i <= 10; i++) {
    herbleData.push({ id: i, number: i, plantId: i });
};

const userStatsData = [
    {
        streak: 0,
        highestStreak: 2,
        gamesPlayed: 10,
        gamesSolved: 2,
        lastSolved: 9,
        userId: 1
    },
    {
        streak: 2,
        highestStreak: 5,
        gamesPlayed: 9,
        gamesSolved: 7,
        lastSolved: 9,
        userId: 2
    },
];

const guessesData = [
    {
        guessNumber: 1,
        guess: 'jackal',
        userId: 1,
        herbleId: 1
    },
    {
        guessNumber: 2,
        guess: 'jackal',
        userId: 1,
        herbleId: 1
    },
    {
        guessNumber: 3,
        guess: 'jackal',
        userId: 1,
        herbleId: 1
    },
    {
        guessNumber: 4,
        guess: 'jackal',
        userId: 1,
        herbleId: 1
    },
    {
        guessNumber: 1,
        guess: 'jackal',
        userId: 2,
        herbleId: 1
    },
    {
        guessNumber: 2,
        guess: 'jackal',
        userId: 2,
        herbleId: 1
    },
    {
        guessNumber: 3,
        guess: 'jackal',
        userId: 2,
        herbleId: 1
    },
    {
        guessNumber: 4,
        guess: 'jackal',
        userId: 2,
        herbleId: 1
    }
];

// Create Plant
// Create User
// Create Herble
// Create UserStats
// Create Guesses

async function main() {
    console.log(plantData);
    await sequelize.sync();
    const users = await User.bulkCreate(userData);
    const herbles = await Herble.bulkCreate(herbleData);
    const stats = await UserStats.bulkCreate(userStatsData);
    const guesses = await Guess.bulkCreate(guessesData);
}

main();