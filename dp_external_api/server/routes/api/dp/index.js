import { Router } from 'express';
import Utils from '../../../extras/Utils';
import { PWM_CONNECTION } from '../../../config';
import { Pool } from 'pg';

const pool = new Pool(PWM_CONNECTION);
import FacebookService from '../../../extras/v1.2/FacebookService';
import AppsflyerService from '../../../extras/v1.2/AppsflyerService';
import { Logging } from '../../../models';
import HttpUtil from '../../../extras/HttpUtils';
import {
	FACEBOOK_API_V1_2 as FACEBOOK_API,
	FACEBOOK_BUSINESS_ACCESS_TOKEN_V4_0 as FACEBOOK_BUSINESS_ACCESS_TOKEN,
	FACEBOOK_UPDATE_CUSTOM_AUDIENCE_PER_TIME,
	FB_AUDIENCE_HASH_TYPE_MAPPING,
	MASKING_DB_MAPPING_CONNECTION,
	REDIS_CONNECTION,
	STATUS_JOB_LIST,
	UNMASKED_DATA_PREVIEW_COUNT,
} from '../../../config';

const router = Router();
const ACCESS_TOKEN = '5i0481Ya6w4SmC6Y4k1gn4D22x5r394T1MH77VbB';

router.use((req, res, next) => {
	const token = req.headers['access-token'];
	if (token !== ACCESS_TOKEN) {
		return Utils.errorResponse(res, 'Unauthorized', 401);
	} else next();
});

router.post('/audiences/:audienceId/users', (req, res) => {
	const body = req.body;
	FacebookService.unmaskDeviceId(body.deviceIds).then((hashedDevices) => {
		const data = {
			access_token: FACEBOOK_BUSINESS_ACCESS_TOKEN.DP,
			payload: {
				schema: 'MOBILE_ADVERTISER_ID',
				data: hashedDevices,
			},
		};
		HttpUtil.postJson(
			FACEBOOK_API.UPDATE_CUSTOM_AUDIENCE.replace(':CUSTOM_AUDIENCE_ID', req.params['audienceId']),
			data
		).then((result) => HttpUtil.makeJsonResponse(res, result));
	});
});

router.post('/audiences', (req, res) => {
	const body = req.body;
	const customAudience = {
		name: body.name,
		description: 'SHARED BY DATA PLATFORM',
		subtype: 'CUSTOM',
		customer_file_source: 'USER_PROVIDED_ONLY',
		access_token: FACEBOOK_BUSINESS_ACCESS_TOKEN.DP,
	};
	HttpUtil.postJson(
		FACEBOOK_API.CREATE_CUSTOM_AUDIENCE.replace(':AD_ACCOUNT_ID', body.facebookAdAccountId),
		customAudience
	).then((result) => {
		const response = {
			...body,
			facebookAudienceId: Utils.safeGet(result, 'id', ''),
		};
		HttpUtil.makeJsonResponse(res, response);
	});
});

router.get('/info', (req, res) => {
	return Utils.jsonResponse(res, { success: true, version: '1.0' });
});

router.post('/createCustomAudience', (req, res) => {
	const token = req.headers['access-token'];
	if (token !== ACCESS_TOKEN) return Utils.errorResponse(res, 'Unauthorized', 401);
	FacebookService.pushUserRawToFacebook(req.body);
	Utils.jsonResponse(res, { message: 'success' });
});

router.post('/updateCustomAudience', (req, res) => {
	const token = req.headers['access-token'];
	if (token !== ACCESS_TOKEN) return Utils.errorResponse(res, 'Unauthorized', 401);
	FacebookService.updateUserRawToFacebook(req.body);
	Utils.jsonResponse(res, { message: 'success' });
});

router.post('/pushAppEvent', (req, res) => {
	let { eventName, appId, event } = req.body;
	const advertisingId = event['Advertising_ID'];
	delete event['Advertising_ID'];
	const extInfo = event['extInfo'] || '';
	FacebookService.pushRawAppEvent(eventName, appId, advertisingId, extInfo, event).then((data) =>
		Utils.jsonResponse(res, data)
	);
});

router.post('/pushAppEvents', (req, res) => {
	let { eventName, appId, currency, events } = req.body;
	Promise.all(
		events.map(async (event) => {
			const advertisingId = event['Advertising_ID'];
			const extInfo = event['extInfo'] || '';
			const currency_value = currency || 'USD';
			delete event['Advertising_ID'];
			const data = await FacebookService.pushRawAppEvent(
				eventName,
				appId,
				advertisingId,
				extInfo,
				currency_value,
				event
			);
			return { userId: data.event['UserID'], message: data.status };
		})
	).then((data) => Utils.jsonResponse(res, data));
});

router.post('/pushAppsflyerEvents', (req, res) => {
	let { eventName, appId, authentication, events } = req.body;
	Promise.all(
		events.map(async (event) => {
			const appsflyerId = event['appsflyerid'];
			const event_time = event['eventTime'];
			delete event['appsflyerid'];
			delete event['eventTime'];
			const data = await AppsflyerService.pushRawAppEvent(
				eventName,
				appId,
				authentication,
				appsflyerId,
				event,
				event_time
			);
			return { event_name: data.eventName, message: data.status };
		})
	).then((data) => Utils.jsonResponse(res, data));
});

router.post('/pushAppsflyerEvent', (req, res) => {
	let { eventName, appId, event } = req.body;
	AppsflyerService.pushRawAppEvent(eventName, appId, event).then((data) =>
		Utils.jsonResponse(res, data)
	);
});

router.get('/gm/:gameId/servers', (req, res) => {
	pool.query(`SELECT * FROM servers ORDER BY id`, (err, results) => {
		if (err) Utils.errorResponse(res, 'Failed to get servers');
		else {
			Utils.jsonResponse(res, results.rows);
		}
	});
});

router.get('/gm/:gameId/occupations', (req, res) => {
	pool.query(`SELECT * FROM occupation ORDER BY id`, (err, results) => {
		if (err) Utils.errorResponse(res, 'Failed to get occupations');
		else {
			Utils.jsonResponse(res, results.rows);
		}
	});
});

router.post('/gm/:gameId/servers', (req, res) => {
	let { serverName, serverId, isActive } = req.body;
	pool.query(
		`INSERT INTO servers (server_id, server_name, is_active) VALUES ('${serverId}', '${serverName}', '${isActive}')`,
		(err, results) => {
			if (err) Utils.errorResponse(res, 'Failed to insert server');
			else {
				Utils.jsonResponse(res, { ...req.body, status: 'Successfully' });
			}
		}
	);
});

router.post('/gm/:gameId/occupations', (req, res) => {
	let { occupationName, occupationId, isActive } = req.body;
	pool.query(
		`INSERT INTO occupation (occupation_id, occupation_name, is_active) VALUES ('${occupationId}', '${occupationName}', '${isActive}')`,
		(err, results) => {
			if (err) Utils.errorResponse(res, 'Failed to insert occupation');
			else {
				Utils.jsonResponse(res, { ...req.body, status: 'Successfully' });
			}
		}
	);
});

router.put('/gm/:gameId/servers/:serverId', (req, res) => {
	const serverId = req.params['serverId'];
	let { serverName, isActive } = req.body;
	const query = `UPDATE servers SET server_name='${serverName}', is_active='${isActive}' WHERE server_id = '${serverId}'`;
	pool.query(query, (err, results) => {
		if (err) Utils.errorResponse(res, 'Failed to update server');
		else {
			Utils.jsonResponse(res, { ...req.body, status: 'Successfully' });
		}
	});
});

router.put('/gm/:gameId/occupations/:occupationId', (req, res) => {
	const occupationId = req.params['occupationId'];
	let { occupationName, isActive } = req.body;
	pool.query(
		`UPDATE occupation SET occupation_name='${occupationName}', is_active='${isActive}' WHERE occupation_id = '${occupationId}'`,
		(err, results) => {
			if (err) Utils.errorResponse(res, 'Failed to update occupation');
			else {
				Utils.jsonResponse(res, { ...req.body, status: 'Successfully' });
			}
		}
	);
});

router.post('/logging', (req, res) => {
	const log = req.body;
	Logging.create(log).then((data) => Utils.jsonResponse(res, data));
});

router.get('/logging', (req, res) => {
	const limit = parseInt(req.query.limit || 100);
	const numPage = parseInt(req.query.numPage || 0);
	const timeLimit = req.query.timeLimit;
	const levels = req.query.levels;
	const sources = req.query.sources;
	const steps = req.query.steps;
	const game = req.query.game;
	let query = {};
	if (timeLimit) query.createdAt = { $gte: new Date(timeLimit)}
	if (levels) query.level = { $in: levels.map((level) => new RegExp(level, 'i')) };
	if (sources) query.source = { $in: sources.map((source) => new RegExp(source, 'i')) };
	if (steps) query['instance.step'] = { $in: steps.map((step) => new RegExp(step, 'i')) };
	if (game) query['instance.game'] = new RegExp(game, 'i');

	Logging.find(query)
		.sort({ _id: -1 })
		.skip(limit * numPage)
		.limit(limit)
		.exec()
		.then((logs) => {
			const result = {
				logs,
				paging: {
					pageSize: limit,
					page: numPage,
					items: logs.length,
				},
			};
			Utils.jsonResponse(res, result);
		})
		.catch((err) => Utils.errorResponse(res, 'Data not found', 400));
});

router.get('/logging/detail', (req, res) => {
	const id = req.query.id;
	Logging.findById(id)
		.then((log) => {
			Utils.jsonResponse(res, log);
		})
		.catch((err) => {
			Utils.errorResponse(res, 'Not found', 400);
		});
});

export default router;
