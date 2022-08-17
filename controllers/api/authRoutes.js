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

        req.session.regenerate((err) => {
            console.log('login regen');
            if (err) next(err);

            req.session.user = user.id;
            req.session.loggedIn = true;
            
            req.session.save((err) => {
                if (err) next(err);
                res.status(200).cookie('loggedIn', true).redirect('/');
            });
        });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

// // Destroys the session
// router.get('/logout', async (req, res) => {
//     if (!req.session) {
//         res.redirect('/');
//     }
//     try {
//         if (req.session.loggedIn) {
//             req.session.user = null;
//             req.session.loggedIn = false;
//             req.session.save((err) => {
//                 if (err) next(err);
//                 req.session.regenerate((err) => {
//                     if (err) next(err)
//                     res.status(200).redirect('/');
//                 });
//             })
//         } else {
//             res.status(200).redirect('/');
//         }
//     } catch (err) {
//     }
// });
