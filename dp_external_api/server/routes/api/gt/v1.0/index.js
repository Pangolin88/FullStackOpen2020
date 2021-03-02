import { Router } from 'express';
import GameMetricRouter from './game-metric';

const router = Router();
router.use('/game-metric', GameMetricRouter);

export default router;