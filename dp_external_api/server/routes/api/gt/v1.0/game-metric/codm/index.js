import { Router } from 'express';
import {
	GAME_METRIC_CONNECTION_CODM,
	HTTP_ERROR_CODE,
} from '../../../../../../config';
import { Pool } from 'pg';
import Utils from '../../../../../../extras/Utils';

const router = Router();
let cacheCCU = [];
const pool = new Pool(GAME_METRIC_CONNECTION_CODM);
router.get('/ccu', (req, res) => {
	const query =
		' ' +
		'SELECT totalonlinecnt as ccu ' +
		'FROM totalonlinecnt ' +
		`WHERE updated_at in (SELECT max(updated_at) FROM totalonlinecnt)`;

	pool.query(query, (err, results) => {
		if (!err) {
			if (results.rows && results.rows.length > 0) {
				cacheCCU = results.rows
			}
			Utils.jsonResponse(res, cacheCCU);
			Utils.logToFile('------Result------' + JSON.stringify(cacheCCU[0]),
				Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH'), 'gt_codm_results'
			);
		} else {
			Utils.logToFile(JSON.stringify(err), 'error', 'gt');
			Utils.errorResponse(res, err);
		}
	});
});

export default router;
