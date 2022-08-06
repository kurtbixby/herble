export { router };

import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.render('main')
    } catch (err) {
        
    }
});

router.get('/login', async (req, res) => {
    try {
        
    } catch (err) {
        
    }
});

router.get('/logout', async (req, res) => {
    try {
        
    } catch (err) {
        
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        
    } catch (err) {
        
    }
});

router.get('/profile', async (req, res) => {
    try {
        
    } catch (err) {
        
    }
});