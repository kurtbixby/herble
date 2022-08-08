export { router };

import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.render('main')
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
    } catch (err) {
      res.status(500).json(err); 
    }
});
