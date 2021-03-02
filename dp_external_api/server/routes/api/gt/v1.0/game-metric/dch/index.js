import { Router } from 'express';
import {
	GAME_METRIC_CONNECTION_DHC,
	HTTP_ERROR_CODE,
} from '../../../../../../config';
import { Pool } from 'pg';
import Utils from '../../../../../../extras/Utils';

const router = Router();

const pool = new Pool(GAME_METRIC_CONNECTION_DHC);
router.get('/ccu', (req, res) => {
	const query =
		' ' +
		'SELECT sid, ccu, platform ' +
		'FROM ccu ' +
		`WHERE ds = (SELECT max(ds) FROM ccu) `;

	pool.query(query, (err, results) => {
		if (!err) {
			Utils.jsonResponse(res, results.rows);
			const logFile = Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH');
			Utils.logToFile(
				' --Result-- ' + JSON.stringify(results.rows),
				logFile,
				'gt_dch_results'
			);
		} else {
			Utils.logToFile(JSON.stringify(err), 'error', 'gt');
			Utils.errorResponse(res, err);
		}
	});
});

router.get('/rank_fight', (req, res) => {
	const limit = req.query.limit || 999999999;
	const rolename = req.query.rolename;
	const server = req.query.server;
	const clazz = req.query['class'];

	let result = [];
	const startedDate =
		req.query.startedDate ||
		Utils.dateToString(new Date(Date.now() - 86400000), 'YYYY-MM-DD');
	const endDate = req.query.endDate || startedDate;

	// Validate
	const start = new Date(startedDate);
	const end = new Date(endDate);

	if (
		start.toString() === 'Invalid Date' ||
		end.toString() === 'Invalid Date'
	) {
		Utils.logToFile('Request invalid format date', 'error', 'gt');
		return Utils.errorResponse(
			res,
			'Invalid Date Format',
			HTTP_ERROR_CODE.BAD_REQUEST
		);
	}

	if ((end - start) / 86400000 > 60) {
		Utils.logToFile('Request invalid date range', 'error', 'gt');
		return Utils.errorResponse(
			res,
			'The date range is invalid. Please select within 60 days',
			HTTP_ERROR_CODE.BAD_REQUEST
		);
	}

	let condition = ' 1 = 1 ';
	if (!!rolename) condition += ` AND rolename = '${rolename}'`;
	if (!!server) condition += ` AND server = ${server}`;
	if (!!clazz) condition += ` AND class = ${clazz}`;

	const query =
		' ' +
		'SELECT DISTINCT stt, rolename, level, lucchien, server, s.name as servername, class, ds ' +
		'FROM rank_fight rf ' +
		'LEFT JOIN servers s ON s.id = rf.server ' +
		`WHERE ${condition} AND ds >= $1 AND ds <= $2 ` +
		'ORDER BY lucchien DESC ' +
		`LIMIT ${limit}`;

	const connection = {
		query: query,
		values: [startedDate, endDate],
	};

	pool.query(connection.query, connection.values, (err, results) => {
		if (!err) {
			Utils.jsonResponse(res, results.rows);
			const logFile = Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH');
			Utils.logToFile(
				`Querying from ${startedDate} to ${endDate}`,
				logFile,
				'gt_dch_results'
			);
			Utils.logToFile(query, logFile, 'gt_dch_results');
			Utils.logToFile(
				'------------Result-------------\n' + JSON.stringify(result),
				logFile,
				'gt_dch_results'
			);
		} else {
			Utils.logToFile(JSON.stringify(err), 'error', 'gt');
			Utils.errorResponse(res, err);
		}
	});
});

router.get('/rank_guild', (req, res) => {
	const limit = req.query.limit || 999999999;
	const tenbang = req.query.guildName;
	const tenbangchu = req.query.guildLeader;
	const serverid = req.query.server || req.query.serverid;

	let result = [];
	const startedDate =
		req.query.startedDate ||
		Utils.dateToString(new Date(Date.now() - 86400000), 'YYYY-MM-DD');
	const endDate = req.query.endDate || startedDate;

	// Validate
	const start = new Date(startedDate);
	const end = new Date(endDate);

	if (
		start.toString() === 'Invalid Date' ||
		end.toString() === 'Invalid Date'
	) {
		Utils.logToFile('Request invalid format date', 'error', 'gt');
		return Utils.errorResponse(
			res,
			'Invalid Date Format',
			HTTP_ERROR_CODE.BAD_REQUEST
		);
	}

	if ((end - start) / 86400000 > 60) {
		Utils.logToFile('Request invalid date range', 'error', 'gt');
		return Utils.errorResponse(
			res,
			'The date range is invalid. Please select within 60 days',
			HTTP_ERROR_CODE.BAD_REQUEST
		);
	}

	let condition = ' 1 = 1 ';
	if (!!tenbang) condition += ` AND tenbang = '${tenbang}'`;
	if (!!tenbangchu) condition += ` AND tenbangchu = '${tenbangchu}'`;
	if (!!serverid) condition += ` AND serverid = ${serverid}`;

	const query =
		' ' +
		'SELECT DISTINCT stt, tenbang, tenbangchu, level, tongchienluc, serverid, s.name as servername, ds ' +
		'FROM rank_guild rg ' +
		'LEFT JOIN servers s ON s.id = rg.serverid ' +
		`WHERE ${condition} AND ds >= $1 AND ds <= $2 ` +
		'ORDER BY tongchienluc DESC ' +
		`LIMIT ${limit}`;

	const connection = {
		query: query,
		values: [startedDate, endDate],
	};

	pool.query(connection.query, connection.values, (err, results) => {
		if (!err) {
			Utils.jsonResponse(res, results.rows);
			const logFile = Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH');
			Utils.logToFile(
				`Querying from ${startedDate} to ${endDate}`,
				logFile,
				'gt_dch_results'
			);
			Utils.logToFile(query, logFile, 'gt_dch_results');
			Utils.logToFile(
				' --Result-- ' + JSON.stringify(result),
				logFile,
				'gt_dch_results'
			);
		} else {
			Utils.logToFile(JSON.stringify(err), 'error', 'gt');
			Utils.errorResponse(res, err);
		}
	});
});

router.get('/rank_ride', (req, res) => {
	const limit = req.query.limit || 999999999;
	const rolename = req.query.rolename;
	const server = req.query.server;
	const clazz = req.query['class'];

	let result = [];
	const startedDate =
		req.query.startedDate ||
		Utils.dateToString(new Date(Date.now() - 86400000), 'YYYY-MM-DD');
	const endDate = req.query.endDate || startedDate;

	// Validate
	const start = new Date(startedDate);
	const end = new Date(endDate);

	if (
		start.toString() === 'Invalid Date' ||
		end.toString() === 'Invalid Date'
	) {
		Utils.logToFile('Request invalid format date', 'error', 'gt');
		return Utils.errorResponse(
			res,
			'Invalid Date Format',
			HTTP_ERROR_CODE.BAD_REQUEST
		);
	}

	if ((end - start) / 86400000 > 60) {
		Utils.logToFile('Request invalid date range', 'error', 'gt');
		return Utils.errorResponse(
			res,
			'The date range is invalid. Please select within 60 days',
			HTTP_ERROR_CODE.BAD_REQUEST
		);
	}

	let condition = ' 1 = 1 ';
	if (!!rolename) condition += ` AND rolename = '${rolename}'`;
	if (!!server) condition += ` AND server = ${server}`;
	if (!!clazz) condition += ` AND class = ${clazz}`;

	const query =
		' ' +
		'SELECT DISTINCT stt, rolename, level, lucchien, server, s.name as servername, class, ds ' +
		'FROM rank_ride rr ' +
		'LEFT JOIN servers s ON s.id = rr.server ' +
		`WHERE ${condition} AND ds >= $1 AND ds <= $2 ` +
		'ORDER BY lucchien DESC ' +
		`LIMIT ${limit}`;

	const connection = {
		query: query,
		values: [startedDate, endDate],
	};

	pool.query(connection.query, connection.values, (err, results) => {
		if (!err) {
			Utils.jsonResponse(res, results.rows);
			const logFile = Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH');
			Utils.logToFile(
				`Querying from ${startedDate} to ${endDate}`,
				logFile,
				'gt_dch_results'
			);
			Utils.logToFile(query, logFile, 'gt_dch_results');
			Utils.logToFile(
				'------------Result-------------' + JSON.stringify(result),
				logFile,
				'gt_dch_results'
			);
		} else {
			Utils.logToFile(JSON.stringify(err), 'error', 'gt');
			Utils.errorResponse(res, err);
		}
	});
});

router.get('/rank_zhuxian', (req, res) => {
	const limit = req.query.limit || 999999999;
	const rolename = req.query.rolename;
	const server = req.query.server;
	const clazz = req.query['class'];

	let result = [];
	const startedDate =
		req.query.startedDate ||
		Utils.dateToString(new Date(Date.now() - 86400000), 'YYYY-MM-DD');
	const endDate = req.query.endDate || startedDate;

	// Validate
	const start = new Date(startedDate);
	const end = new Date(endDate);

	if (
		start.toString() === 'Invalid Date' ||
		end.toString() === 'Invalid Date'
	) {
		Utils.logToFile('Request invalid format date', 'error', 'gt');
		return Utils.errorResponse(
			res,
			'Invalid Date Format',
			HTTP_ERROR_CODE.BAD_REQUEST
		);
	}

	if ((end - start) / 86400000 > 60) {
		Utils.logToFile('Request invalid date range', 'error', 'gt');
		return Utils.errorResponse(
			res,
			'The date range is invalid. Please select within 60 days',
			HTTP_ERROR_CODE.BAD_REQUEST
		);
	}

	let condition = ' 1 = 1 ';
	if (!!rolename) condition += ` AND rolename = '${rolename}'`;
	if (!!server) condition += ` AND server = ${server}`;
	if (!!clazz) condition += ` AND class = ${clazz}`;

	const query =
		' ' +
		'SELECT DISTINCT stt, rolename, level, lucchien, tang, server, s.name as servername,  class, ds ' +
		'FROM rank_zhuxian rz ' +
		'LEFT JOIN servers s ON s.id = rz.server ' +
		`WHERE ${condition} AND ds >= $1 AND ds <= $2 ` +
		'ORDER BY tang DESC ' +
		`LIMIT ${limit}`;

	const connection = {
		query: query,
		values: [startedDate, endDate],
	};

	pool.query(connection.query, connection.values, (err, results) => {
		if (!err) {
			Utils.jsonResponse(res, results.rows);
			const logFile = Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH');
			Utils.logToFile(
				`Querying from ${startedDate} to ${endDate}`,
				logFile,
				'gt_dch_results'
			);
			Utils.logToFile(query, logFile, 'gt_dch_results');
			Utils.logToFile(
				'------------Result-------------' + JSON.stringify(result),
				logFile,
				'gt_dch_results'
			);
		} else {
			Utils.logToFile(JSON.stringify(err), 'error', 'gt');
			Utils.errorResponse(res, err);
		}
	});
});

export default router;
