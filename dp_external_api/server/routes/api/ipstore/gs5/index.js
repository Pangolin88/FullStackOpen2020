import { Router } from 'express';
import V1_0Router from './v1';

const Gs5Router = Router();

Gs5Router.use('/v1.0', V1_0Router);

export default Gs5Router;