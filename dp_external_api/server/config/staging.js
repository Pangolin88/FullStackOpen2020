import path from 'path';

export const AUTH = {
	mongoConnection:
		'mongodb://vng_vdp_external_sns_collaboration:klH82ja1PPP@10.60.47.17:27017/vng_vdp_external_sns_collaboration',
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
	host: '10.60.47.17',
	port: '6379',
	password: '27}p3(w1t@2678A',
	db: 0,
};

export const MASKING_DB_MAPPING_CONNECTION = {
	host: '10.60.47.17',
	port: '5432',
	database: 'uid_v2',
	user: 'uid_ro',
	password: 'L^5!2@of42WHvIZ',
};

export const IP_STORE_SERVICE = {
	url: 'http://10.50.44.17:8298/external/lookup-batch',
	token: 'cwbMq9U6cfMp7Mgm9BgJJcQ3DE652ZfrjTLqGjVMx2Nh',
};

export * from './constants';
