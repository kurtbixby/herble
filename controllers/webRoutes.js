export { router };
import fetch from 'node-fetch';

import express from 'express';

const router = express.Router();
const BASE_URL = 'http://localhost';
const API_PORT = process.env.PORT || 3001;

router.get('/', async (req, res) => {
    try {
      res.render('gamePage')
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get('/login', async (req, res) => {
  // if(req.session.loggedIn) {
  //   // redirect?
  //   return;
  // }
  try {
      res.render('signin')
    } catch (err) {
      res.status(500).json(err); 
    }
});
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

// router.get('/plants')
// include two paramters for the file and for handlebars
router.get('/plants', async (req, res) => {
  try {
    const fetchUrl = `${BASE_URL}:${API_PORT}/api/plants`;
    const plantsData = await (await fetch(fetchUrl)).json();
    console.log(plantsData);
    res.render('plants', {plants: plantsData})
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});
