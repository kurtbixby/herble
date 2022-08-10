export { router };

import express from 'express';
import { User } from '../../models/index.js';

const router = express.Router();

// Checks for the user then checks the password
// Sets the session's user_id and logged_in status
router.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findOne({ where: { email: req.body.email }});
        console.log(user);

        if (!user) {
            console.error('No user');
            res.status(400).json({ message: 'Incorrect email or password, please try again'});
            return;
        }

        const validPassword = user.checkPassword(req.body.password);

        if (!validPassword) {
            console.error('Invalid password');
            res.status(400).json({ message: 'Incorrect email or password, please try again'});
            return;
        }

        req.session.save(() => {
            req.session.user_id = user.id;
            req.session.loggedIn = true;
        })
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

// Destroys the session
router.get('/logout', async (req, res) => {
    try {
        if (req.session.loggedIn) {
            req.session.destroy(() => {
                res.status(204).end();
            })
        } else {
            res.redirect('/');
        }
    } catch (err) {
    }
});
