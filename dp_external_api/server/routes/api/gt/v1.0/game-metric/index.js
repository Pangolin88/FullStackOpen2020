import { Router } from 'express';
import MuaRouter from './mua';
import DchRouter from './dch';
import CodmRouter from './codm';

const router = Router();

router.use('/mua', MuaRouter);
router.use('/dch', DchRouter);
router.use('/codm', CodmRouter);

export default router;
