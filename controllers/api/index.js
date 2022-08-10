export { router };

import express from 'express';

import { router as authRouter } from './authRoutes.js';
import { router as dataRouter } from './dataRoutes.js';

const router = express.Router();

router.use('/', authRouter);
router.use('/', dataRouter);