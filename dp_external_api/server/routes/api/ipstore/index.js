import { Router } from 'express';
import { JWT_SECRECT  } from '../../../config';
import jwt from 'express-jwt';
import Utils from '../../../extras/Utils';
import GtRouter from './gt';
import BaRouter from './ba';
import Gs5Router from './gs5';
import HttpUtil from '../../../extras/HttpUtils';

const router = Router();
router.get('/info', (req, res) => {
	HttpUtil.makeJsonResponse(res, { message: 'successfully' });
});

router.use(
	jwt({
		secret: JWT_SECRECT,
		credentialsRequired: true,
		requestProperty: 'credential',
	})
);

router.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		Utils.logToFile(err.message, 'error', 'logs');
		Utils.errorResponse(res, 'Invalid Token', 401);
	} else {
		next();
	}
});
router.use('/:department', (req, res, next) => {
	const dept = req.credential['department'];
    const deptParam = req.params['department'];
	if (dept !== deptParam) {
		Utils.logToFile('This token belongs to another Department', 'error', 'logs');
		return Utils.errorResponse(res, `This token belongs to ${dept.toUpperCase()}`, 403);
	}
	next();
});

router.use('/gt', GtRouter);
router.use('/ba', BaRouter);
router.use('/gs5', Gs5Router);

export default router;
