import { Router } from 'express';
import GameMetricRouter from './game-metric';

const V1_0Router = Router();
V1_0Router.use('/game-metric', GameMetricRouter);
export default V1_0Router;