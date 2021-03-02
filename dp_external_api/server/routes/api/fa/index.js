import { Router } from 'express';
import V1_0Router from './v1.0';

const router = Router();
router.use('/v1.0', V1_0Router);
export default router;