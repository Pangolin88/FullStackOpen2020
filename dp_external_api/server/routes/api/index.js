import { Router } from 'express';
import DalRouter from './dal';
import { JWT_SECRECT } from '../../config';
import jwt from 'express-jwt';
import Utils from '../../extras/Utils';
import PassRouter from './pass';
import FaRouter from './fa';
import GtRouter from './gt';
import DpRouter from './dp';
import GS1Router from './gs1';
import GS5Router from './gs5';
import HttpUtil from '../../extras/HttpUtils';
import IpstoreRouter from './ipstore';

const router = Router();
router.get('/info', (req, res) => {
	HttpUtil.makeJsonResponse(res, { message: 'successfully' });
});

router.use('/dp', DpRouter);

router.use('/ipstore', IpstoreRouter);

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

router.use('/dal', DalRouter);
router.use('/pass', PassRouter);
router.use('/fa', FaRouter);
router.use('/gt', GtRouter);
router.use('/gs1', GS1Router);
router.use('/gs5', GS5Router);

export default router;
