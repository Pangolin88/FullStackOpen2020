import { Router } from 'express';
import pwmRouter from './pwm_sea';

const GS5Route = Router();

GS5Route.use('/pwm_sea', pwmRouter);

export default GS5Route;