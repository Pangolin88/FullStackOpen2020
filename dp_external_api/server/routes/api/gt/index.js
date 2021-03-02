import { Router } from 'express';
import V1_0Router from './v1.0';

const GtRouter = Router();

GtRouter.use('/v1.0', V1_0Router);

export default GtRouter;