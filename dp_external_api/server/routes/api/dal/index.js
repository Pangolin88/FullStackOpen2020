import { Router } from 'express';
import V1_0Router from './v1.0';
import V1_1Router from './v1.1';
import V1_2Router from './v1.2';
const DalRouter = Router();
DalRouter.use('/v1.0', V1_0Router);
DalRouter.use('/v1.1', V1_1Router);
DalRouter.use('/v1.2', V1_2Router);
export default DalRouter;