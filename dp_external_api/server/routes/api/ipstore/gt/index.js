import { Router } from 'express';
import V1_0Router from './v1';
import V2_0Router from './v2';

const GtRouter = Router();

GtRouter.use('/v1.0', V1_0Router);
GtRouter.use('/v2.0', V2_0Router);

export default GtRouter;