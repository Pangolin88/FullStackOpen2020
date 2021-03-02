import { Router } from 'express';
import pwmRouter from './tmdl';

const GS5Route = Router();

GS5Route.use('/pwm_sea', pwmRouter);

export default GS5Route;