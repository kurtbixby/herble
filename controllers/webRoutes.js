export { router };
import fetch from 'node-fetch';

import express from 'express';

const router = express.Router();
const BASE_URL = 'http://localhost';
const API_PORT = process.env.PORT || 3001;

router.get('/', async (req, res) => {
    try {
      let loggedIn = false;
      if (req.session) {
        console.log('session present');
        loggedIn = req.session.loggedIn;
      }
      console.log(req.session);
      res.render('gamePage', { loggedIn });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
});

router.get('/login', loginSignUp);
router.get('/signup', loginSignUp);

async function loginSignUp(req, res) {
  try {
    res.render('signin')
  } catch (err) {
    res.status(500).json(err); 
  }
}

// IM NOT SURE WHAT TO DO HERE
// router.get('/logout', async (req, res) => {
//     try {
//         res.render()
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// Destroys the session
router.get('/logout', async (req, res) => {
  if (!req.session) {
      res.redirect('/');
  }
  try {
      if (req.session.loggedIn) {
          req.session.user = null;
          req.session.loggedIn = false;
          req.session.save((err) => {
              if (err) next(err);
              req.session.regenerate((err) => {
                  if (err) next(err)
                  res.status(200).redirect('/');
              });
          })
      } else {
          res.status(200).redirect('/');
      }
  } catch (err) {
  }
});

// router.get('/users/:signup', async (req, res) => {
//     try {
//     } catch (err) {
//       res.status(500).json(err); 
//     }
// });

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
