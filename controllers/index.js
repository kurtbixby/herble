export { router };

import express from 'express';

import { router as apiRouter } from './api/index.js';
import { router as webRoutes } from './webRoutes.js';

const router = express.Router();

router.use('/auth', apiRouter);
router.use('/', webRoutes);