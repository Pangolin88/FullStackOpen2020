import path from 'path';

export const AUTH = {
	mongoConnection: 'mongodb://dp_external_api:klH82ja1PPP@10.50.44.12:27017/dp_external_api',
};

export const UPLOADED_DATA_DIR = path.join(
	__dirname,
	'..',
	'..',
	'..',
	'vng_vdp_external_sns_collaboration_uploaded_data'
);
export const UNMASKED_DATA_DIR = path.join(
	__dirname,
	'..',
	'..',
	'..',
	'vng_vdp_external_sns_collaboration_unmasked_data'
);
export const LOGS_DIR = path.join(
	__dirname,
	'..',
	'..',
	'..',
	'vng_vdp_external_sns_collaboration_logs'
);

export const REDIS_CONNECTION = {
	host: '10.60.47.12',
	port: '6379',
	password: '27}p3(w1t@2678A',
	db: 0,
};

export const MASKING_DB_MAPPING_CONNECTION = {
	host: '10.60.47.16',
	port: '5432',
	database: 'uid_v2',
	user: 'uid_ro',
	password: 'L^5!2@of42WHvIZ',
};

export const GAME_METRIC_CONNECTION = {
	host: '10.50.44.12',
	port: '5432',
	database: 'game_metric',
	user: 'airflow',
	password: 'CwqU4xXpJCBCCwEDpIdl',
};

export const GAME_METRIC_CONNECTION_MUA = {
	host: '10.50.44.12',
	port: '5432',
	database: 'game_metric_mua',
	user: 'airflow',
	password: 'CwqU4xXpJCBCCwEDpIdl',
};

export const GAME_METRIC_CONNECTION_DHC = {
	host: '10.50.44.99',
	port: '32120',
	database: 'dch',
	user: 'postgres',
	password: 'fPJYUp9np6ZZzeLFDB53',
};

export const GAME_METRIC_CONNECTION_CODM = {
	host: '10.50.44.113',
	port: '32120',
	database: 'codm_426',
	user: 'postgres',
	password: 'fPJYUp9np6ZZzeLFDB53',
};

export const PWM_CONNECTION = {
	host: '10.50.44.99',
	port: '32120',
	database: 'pwm_vn',
	user: 'postgres',
	password: 'fPJYUp9np6ZZzeLFDB53',
};

export const PWM_SEA_CONNECTION = {
	host: '10.50.44.99',
	port: '32120',
	database: 'pwm_sea',
	user: 'postgres',
	password: 'fPJYUp9np6ZZzeLFDB53',
};

export const TMDL_CONNECTION ={
	host: '10.50.44.99',
	port: '32120',
	database: 'tmdl',
	user: 'postgres',
	password: 'fPJYUp9np6ZZzeLFDB53',
};

export const JX_PROMOTION_CONNECTION = {
	host: '10.50.44.99',
	port: '32120',
	database: 'jx_promotion',
	user: 'postgres',
	password: 'fPJYUp9np6ZZzeLFDB53',
};

export const IP_STORE_SERVICE = {
	url: 'http://10.50.44.17:8298/external/lookup-batch',
	token: 'cwbMq9U6cfMp7Mgm9BgJJcQ3DE652ZfrjTLqGjVMx2Nh',
};

export * from './constants';
