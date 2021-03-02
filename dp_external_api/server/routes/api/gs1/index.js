import { Router } from 'express';
import pwmRouter from './pwm';
import jxRouter from './jx';

const GS1Router = Router();

GS1Router.use('/pwm', pwmRouter);
GS1Router.use('/jx', jxRouter);

export default GS1Router;