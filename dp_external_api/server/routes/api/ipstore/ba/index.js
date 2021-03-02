import { Router } from 'express';
import V1_0Router from './v1';

const BaRouter = Router();

BaRouter.use('/v1.0', V1_0Router);

export default BaRouter;