import path from 'path';

export const AUTH = {
    mongoConnection: 'mongodb://localhost:27017/vng_vdp_external_sns_collaboration'
};

export const UPLOADED_DATA_DIR = path.join(__dirname, '..', '..', 'vng_vdp_external_sns_collaboration_uploaded_data');
export const UNMASKED_DATA_DIR = path.join(__dirname, '..', '..', 'vng_vdp_external_sns_collaboration_unmasked_data');
export const LOGS_DIR = path.join(__dirname, '..', '..', 'logs');

export const REDIS_CONNECTION = {
    host: '127.0.0.1',
    port: '6379',
    password: '27}p3(w1t@2678A',
    db: 0
};

export const MASKING_DB_MAPPING_CONNECTION = {
    user: 'postgres',
    host: '127.0.0.1',
    port: '5432',
    database: 'uid_v2'
}

export const GAME_METRIC_CONNECTION = {
    host: 'localhost',
    port: '5432',
    database: 'game_metric',
    user: 'airflow',
    password: 'CwqU4xXpJCBCCwEDpIdl'
}

export const GAME_METRIC_CONNECTION_DHC = {
    host: 'localhost',
    port: '5432',
    database: 'game_metric',
    user: 'airflow',
    password: 'CwqU4xXpJCBCCwEDpIdl'
}

export const IP_STORE_SERVICE = {
	url: 'http://localhost:8298/external/lookup-batch',
	token: 'cwbMq9U6cfMp7Mgm9BgJJcQ3DE652ZfrjTLqGjVMx2Nh',
};

export * from './constants';
