export { router };
import { User } from '../models/User.js';

import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.render('/layouts.main')
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get('/login', async (req, res) => {
  if(req.session.loggedIn){  
  try {
        res.render('login')
    } catch (err) {
      res.status(500).json(err); 
    }
}});
// IM NOT SURE WHAT TO DO HERE
router.get('/logout', async (req, res) => {
  if(req.session.loggedOut){  
  try {
        res.render()
    } catch (err) {
      res.status(500).json(err);
    }
}});

router.get('/users/:signup', async (req, res) => {
    try {
        const userSignUp = await User.findByPk(req.params.id, {
          include: [
            {
              model: User,
              attributes: [
                'id',
                'username',
                'email',
                'password'

              ],
            },
          ],
        })
    } catch (err) {
      res.status(500).json(err); 
    }
});

// router.get('/plants')
// include two paramters for the file and for handlebars
router.get('/plants', async (req, res) => {
  try {
    const plantsData = []; 
res.render('plants', {plants: plantsData})
  }
})
