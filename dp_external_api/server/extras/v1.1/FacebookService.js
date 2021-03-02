import readline from 'readline';
import fs from 'fs';
import {
    FACEBOOK_API_V1_1 as FACEBOOK_API,
    FACEBOOK_BUSINESS_ACCESS_TOKEN_V3_3 as FACEBOOK_BUSINESS_ACCESS_TOKEN,
    FACEBOOK_UPDATE_CUSTOM_AUDIENCE_PER_TIME,
    FB_AUDIENCE_HASH_TYPE_MAPPING,
    REDIS_CONNECTION,
    STATUS_JOB_LIST,
    UNMASKED_DATA_PREVIEW_COUNT
} from '../../config';
import {Utils} from '../index';
import redis from 'redis';

// var commonConfig = require('../config/common');
// var constants = require('../extras/constants');
// var utils = require('../extras/utils');
const UNMASKED_DATA_DEBUG_COUNT = 10000;


export default class FacebookService {

    static unmaskingData(audienceList) {
        const redisClient = redis.createClient(REDIS_CONNECTION);
        const {storedFileName, maskedType} = audienceList;
        const maskedFilePath = Utils.buildUploadFilePath(storedFileName);
        const nullLookUpFilePath = maskedFilePath.replace('.txt', '_NULL_lookup.txt');
        const nullLookupFile = fs.createWriteStream(nullLookUpFilePath, {flags: 'w'});

        let unmaskedUserIdentities = [];
        let unmaskedUserIdentitiesDict = {};
        let previews = [];
        let lineCount = 0;
        let nullLookupDBCount = 0;

        return new Promise(function (resolve, reject) {
            const lineReader = readline.createInterface({
                input: fs.createReadStream(maskedFilePath)
            });

            lineReader.on('line', function (line) {
                // mapping:uid_device_id
                // mapping:uid_phone
                // mapping:uid_mail
                // mapping:encrypt_phone
                // mapping:encrypt_mail
                try {
                    line = parseInt(line);
                } catch (err) {
                    Utils.logErrorToFileForAudience(err);
                }

                const processResult = () => {
                    audienceList.countValid = unmaskedUserIdentities.length;
                    audienceList.preview = previews;
                    audienceList.save().then(() => resolve(unmaskedUserIdentities));
                };

                redisClient.hget('mapping:uid_' + maskedType, line, (error, unmaskedData) => {
                    lineCount += 1;
                    if (error) throw error;
                    if (!unmaskedData || (unmaskedData == 'None')) {
                        // pool.query(`SELECT normalize_${maskedType} FROM public.uid_${maskedType} WHERE uid_${maskedType} = ${line}`, (err, res) => {
                        //     if (!err) {
                        //         redisClient.hset('mapping:uid_' + maskedType, line, res.rows[0].normalize_device_id)
                        //         nullLookupRedisCount += 1;
                        //         nullLookupRedisFile.write(line + '\n');
                        //     } else {
                        //         nullLookupDBCount += 1;
                        //         nullLookupFile.write(line+'\n');
                        //     }
                        // })
                        nullLookupDBCount += 1;
                        nullLookupFile.write(line + '\n');
                        if (lineCount === audienceList.countValid)
                            return processResult();
                    } else {
                        let result = unmaskedData.toLowerCase();
                        if (maskedType === 'phone')
                            result = result.replace('+84', '84');
                        if ((previews.length < UNMASKED_DATA_PREVIEW_COUNT) && (!previews.includes(result)))
                            previews.push(result);
                        const hashedValue = Utils.hashSha256(result);
                        if (!(hashedValue in unmaskedUserIdentitiesDict)) {
                            unmaskedUserIdentitiesDict[hashedValue] = true;
                            unmaskedUserIdentities.push(hashedValue);
                        }
                        if (lineCount === audienceList.countReceived)
                            return processResult();
                    }
                });
            });
            lineReader.on('close', function () {
            });
        });
    }

    // Written by Kuls
    static unMaskFileToFile(maskedFilePath, maskedType) {
        const redisClient = redis.createClient(REDIS_CONNECTION);
        const nullLookUpFilePath = maskedFilePath.replace('.txt', '_NULL_lookup.txt');
        const nullLookupFile = fs.createWriteStream(nullLookUpFilePath, {flags: 'w'});
        const maskedFile = fs.createWriteStream(Utils.buildUnmaskedDataFile('result_' + (new Date()).toDateString()), {flags: 'w'});
        let lineCount = 0;
        let nullLookupDBCount = 0;

        return new Promise(function (resolve, reject) {

            const processResult = () => {
                resolve("Successful");
            };

            Utils.countLinesInFile(maskedFilePath, (totalLines) => {
                const lineReader = readline.createInterface({
                    input: fs.createReadStream(maskedFilePath)
                });
                lineReader.on('line', function (line) {
                    // mapping:uid_device_id
                    // mapping:uid_phone
                    // mapping:uid_mail
                    // mapping:encrypt_phone
                    // mapping:encrypt_mail
                    try {
                        line = parseInt(line);
                    } catch (err) {
                        Utils.logErrorToFileForAudience(err);
                    }
                    redisClient.hget('mapping:uid_' + maskedType, line, (error, unmaskedData) => {
                        lineCount += 1;
                        if (error) throw error;
                        if (!unmaskedData || (unmaskedData == 'None')) {
                            nullLookupDBCount += 1;
                            nullLookupFile.write(line + '\n');
                            if (lineCount === totalLines)
                                return processResult();
                        } else {
                            let result = unmaskedData.toLowerCase();
                            if (maskedType === 'phone')
                                result = result.replace('+84', '84');
                            if (lineCount % UNMASKED_DATA_DEBUG_COUNT === 0)
                                console.log("Push : " + lineCount + " to results");
                            maskedFile.write(result + '\n');
                            if (lineCount === totalLines)
                                return processResult();
                        }
                    });
                })
                lineReader.on('close', function () {
                });
            });
        });
    }

    // Written by Kuls
    static unMaskFile(maskedFilePath, maskedType) {
        const redisClient = redis.createClient(REDIS_CONNECTION);
        let lineCount = 0;
        return new Promise(function (resolve, reject) {
            const processResult = () => {
                resolve("Successful");
            };
            Utils.countLinesInFile(maskedFilePath, (totalLines) => {
                lineCount += 1;
                const lineReader = readline.createInterface({
                    input: fs.createReadStream(maskedFilePath)
                });
                lineReader.on('line', function (line) {
                    // mapping:uid_device_id
                    // mapping:uid_phone
                    // mapping:uid_mail
                    // mapping:encrypt_phone
                    // mapping:encrypt_mail
                    try {
                        let row = line.split(',', 2);
                        let uid_device_id = parseInt(row[0]);
                        let normalize_device_id = row[1];
                        redisClient.hset('mapping:uid_' + maskedType, uid_device_id, normalize_device_id)
                    } catch (err) {
                        Utils.logErrorToFileForAudience(err);
                    }
                    if (lineCount === totalLines)
                        return processResult();
                })
                lineReader.on('close', function () {
                });
            });
        });
    }

    static readFileContent(audienceList) {
        const {storedFileName} = audienceList;
        const filePath = Utils.buildUploadFilePath(storedFileName);

        let events = [];
        let previews = [];
        let lineCount = 0;

        return new Promise(function (resolve, reject) {
            const lineReader = readline.createInterface({
                input: fs.createReadStream(filePath)
            });

            lineReader.on('line', function (line) {

                const processResult = () => {
                    audienceList.preview = previews;
                    audienceList.save().then(() => resolve(events));
                };

                lineCount += 1;
                if (previews.length < UNMASKED_DATA_PREVIEW_COUNT)
                    previews.push(line);
                try {
                    line = JSON.parse(line);
                    events.push(line);
                    if (lineCount === audienceList.countReceived)
                        return processResult();
                } catch (err) {
                    Utils.logErrorToFileForAnalyticAppEvent(err);
                }
            });

            lineReader.on('close', function () {
            });
        });
    }


    static pushUserToFacebook(audienceList, identities) {
        const {facebookAudienceListName, facebookAdAccountId, businessId, maskedType, countValid} = audienceList;
        const ad_account_id = facebookAdAccountId;
        const access_token = FACEBOOK_BUSINESS_ACCESS_TOKEN[businessId.toUpperCase()];
        const audienceName = 'Shared by DP - ' + facebookAudienceListName + ' ' + Utils.generateShortUUID();
        const audienceDescription = 'Created by DP automatic tools';

        const pushUser = (resolve, facebookAudienceId) => {

            const submitToFacebook = function (users) {
                const data = {
                    access_token,
                    payload: {
                        "schema": FB_AUDIENCE_HASH_TYPE_MAPPING[maskedType],
                        "data": users
                    }
                };
                const headers = {'Content-type': 'application/json'};
                const callbackSuccess = (result) => {
                    let message = 'Session: ' + result.session_id + ' Updated AudienceID ' + result.audience_id + ' :' + result.num_received;
                    if (result.num_invalid_entries > 0)
                        message = message + ' Invalid:' + result.num_invalid_entries + ' Invalid sample:' + JSON.stringify(result.invalid_entry_samples);
                    Utils.logToFileForAudience(message);
                };
                const callbackError = (error) => {
                    Utils.logErrorToFileForAudience(JSON.stringify(error.response.data.error));
                    resolve({
                        status: 'failed',
                        message: JSON.stringify(error.response.data.error)
                    });
                };
                const maxTimeOut = countValid * 3.6;
                const minTimeOut = 3000;
                const timeout = Math.floor(Math.random() * (maxTimeOut - minTimeOut)) + minTimeOut;
                setTimeout(() => {
                    Utils.logToFileForAudience(`Post data to ${facebookAudienceId}`)
                    Utils.makeHttpRequest('post', FACEBOOK_API.UPDATE_CUSTOM_AUDIENCE.replace(':CUSTOM_AUDIENCE_ID', facebookAudienceId), callbackSuccess, callbackError, data, headers, true);
                }, timeout);

            };

            let lineCount = 0;
            let submitList = [];
            for (let line of identities) {
                lineCount += 1;
                submitList.push(line);
                if ((submitList.length == FACEBOOK_UPDATE_CUSTOM_AUDIENCE_PER_TIME) || (lineCount == countValid)) {
                    submitToFacebook(submitList);
                    submitList = [];
                    if (lineCount === countValid)
                        resolve({
                            status: 'success'
                        });
                }
            }
        };

        return new Promise(function (resolve, reject) {
            const callbackSuccess = (facebookResult) => {
                if (!Utils.safeGet(facebookResult, 'id')) {
                    Utils.logErrorToFileForAudience('Cannot create Audience List on Facebook: ' + facebookResult);
                    resolve({
                        status: 'failed',
                        message: 'Cannot create Audience List on Facebook'
                    });
                } else {
                    audienceList.facebookAudienceListId = facebookResult.id;
                    audienceList.status = STATUS_JOB_LIST.SUBMITTED;
                    audienceList.save().then(() => pushUser(resolve, facebookResult.id));
                }
            };
            const callbackError = (error) => {
                Utils.logErrorToFileForAudience(JSON.stringify(error.response.data.error));
                resolve({
                    status: 'failed',
                    message: JSON.stringify(error.response.data.error)
                });
            };
            const dataFacebook = {
                name: audienceName,
                description: audienceDescription,
                subtype: 'CUSTOM',
                customer_file_source: 'USER_PROVIDED_ONLY',
                access_token: access_token
            };
            Utils.makeHttpRequest('post', FACEBOOK_API.CREATE_CUSTOM_AUDIENCE.replace(':AD_ACCOUNT_ID', ad_account_id), callbackSuccess, callbackError, dataFacebook);
        });
    }

    static pushUserRawToFacebook(audience) {
        const {name, facebookAdAccount, businessId, maskedType, countValid, filePath} = audience;
        const ad_account_id = facebookAdAccount;
        const access_token = FACEBOOK_BUSINESS_ACCESS_TOKEN[businessId.toUpperCase()];
        const audienceName = 'Shared by DP - ' + name + ' ' + Utils.generateShortUUID();
        const audienceDescription = 'Created by DP automatic tools';
        const pushUser = (resolve, facebookAudienceId) => {
            Utils.logToFileForAudience(`Push User to ${facebookAudienceId}`)
            const submitToFacebook = function (users) {
                Utils.logToFileForAudience(`Submit ${users.length} users to ${facebookAudienceId}`)
                const data = {
                    access_token,
                    payload: {
                        "schema": FB_AUDIENCE_HASH_TYPE_MAPPING[maskedType],
                        "data": users
                    }
                };
                const headers = {'Content-type': 'application/json'};
                const callbackSuccess = (result) => {
                    let message = 'Session: ' + result.session_id + ' Updated AudienceID ' + result.audience_id + ' :' + result.num_received;
                    if (result.num_invalid_entries > 0)
                        message = message + ' Invalid:' + result.num_invalid_entries + ' Invalid sample:' + JSON.stringify(result.invalid_entry_samples);
                    Utils.logToFileForAudience(message);
                };

                const callbackError = (error) => {
                    Utils.logErrorToFileForAudience(JSON.stringify(error.response.data.error));
                    resolve({
                        status: 'failed',
                        message: JSON.stringify(error.response.data.error)
                    });
                };

                Utils.logToFileForAudience(`Post data to ${facebookAudienceId}`)
                const maxTimeOut = countValid * 0.45;
                const minTimeOut = 3000;
                const timeout = Math.floor(Math.random() * (maxTimeOut - minTimeOut)) + minTimeOut;
                setTimeout(() => {
                    Utils.makeHttpRequest('post', FACEBOOK_API.UPDATE_CUSTOM_AUDIENCE.replace(':CUSTOM_AUDIENCE_ID', facebookAudienceId), callbackSuccess, callbackError, data, headers, true);
                }, timeout);
            };

            const hashingIdentities = function (filePath) {
                let unmaskedUserIdentities = []
                let lineCount = 0;
                return new Promise((resolve, reject) => {
                    const lineReader = readline.createInterface({
                        input: fs.createReadStream(filePath)
                    });
                    lineReader.on('line', function (line) {
                        let result = line.toLowerCase();
                        if (maskedType === 'phone')
                            result = result.replace('+84', '84');
                        const hashedValue = Utils.hashSha256(result);
                        unmaskedUserIdentities.push(hashedValue);
                        if (lineCount % 100000 === 0) Utils.logToFileForAudience(`Hashing ${lineCount} elements`)
                        ++lineCount;
                        if (lineCount === countValid) resolve(unmaskedUserIdentities)
                    });
                    lineReader.on('close', function () {
                    });
                })
            }

            hashingIdentities(filePath).then(identities => {
                Utils.logToFileForAudience(`Ready to submit Facebook Audience ID ${facebookAudienceId}`)
                let lineCount = 0;
                let submitList = [];
                for (let line of identities) {
                    lineCount += 1;
                    submitList.push(line);
                    if ((submitList.length == FACEBOOK_UPDATE_CUSTOM_AUDIENCE_PER_TIME) || (lineCount == identities.length)) {
                        submitToFacebook(submitList);
                        submitList = [];
                        if (lineCount === countValid)
                            resolve({
                                status: 'success'
                            });
                    }
                }
            })
        };

        return new Promise(function (resolve, reject) {
            const callbackSuccess = (facebookResult) => {
                Utils.logToFileForAudience(`Audience ${facebookResult.id} has been created`)
                if (!Utils.safeGet(facebookResult, 'id')) {
                    Utils.logErrorToFileForAudience('Cannot create Audience List on Facebook: ' + facebookResult);
                    resolve({
                        status: 'failed',
                        message: 'Cannot create Audience List on Facebook'
                    });
                } else {
                    Utils.logToFileForAudience(`Post data to ${facebookResult.id}`)
                    pushUser(resolve, facebookResult.id);
                }
            };
            const callbackError = (error) => {
                Utils.logErrorToFileForAudience(JSON.stringify(error.response.data.error));
                reject({
                    status: 'failed',
                    message: JSON.stringify(error.response.data.error)
                });
            };
            const dataFacebook = {
                name: audienceName,
                description: audienceDescription,
                subtype: 'CUSTOM',
                customer_file_source: 'USER_PROVIDED_ONLY',
                access_token: access_token
            };
            Utils.logToFileForAudience(`Create Custom Audience`)
            Utils.logToFileForAudience(JSON.stringify(dataFacebook))
            Utils.makeHttpRequest('post', FACEBOOK_API.CREATE_CUSTOM_AUDIENCE.replace(':AD_ACCOUNT_ID', ad_account_id), callbackSuccess, callbackError, dataFacebook);
        });
    }

    static updateUserToFacebook(audienceList, identities) {
        const {businessId, maskedType, countValid, facebookAudienceListId} = audienceList;
        Utils.logToFileForAudience("Start to update for Facebook Audience ID: " + facebookAudienceListId);
        const access_token = FACEBOOK_BUSINESS_ACCESS_TOKEN[businessId.toUpperCase()];
        const pushUser = (resolve, facebookAudienceId) => {

            const submitToFacebook = function (users) {
                const data = {
                    access_token,
                    payload: {
                        "schema": FB_AUDIENCE_HASH_TYPE_MAPPING[maskedType],
                        "data": users
                    }
                };
                const headers = {'Content-type': 'application/json'};
                const callbackSuccess = (result) => {
                    let message = 'Session: ' + result.session_id + ' Updated AudienceID ' + result.audience_id + ' :' + result.num_received;
                    if (result.num_invalid_entries > 0)
                        message = message + ' Invalid:' + result.num_invalid_entries + ' Invalid sample:' + JSON.stringify(result.invalid_entry_samples);
                    Utils.logToFileForAudience(message);
                };
                const callbackError = (error) => {
                    Utils.logErrorToFileForAudience(JSON.stringify(error.response.data.error));
                    resolve({
                        status: 'failed',
                        message: JSON.stringify(error.response.data.error)
                    });
                };
                const maxTimeOut = countValid * 3.6;
                const minTimeOut = 3000;
                const timeout = Math.floor(Math.random() * (maxTimeOut - minTimeOut)) + minTimeOut;
                setTimeout(() => {
                    console.log(timeout)
                    Utils.makeHttpRequest('post', FACEBOOK_API.UPDATE_CUSTOM_AUDIENCE.replace(':CUSTOM_AUDIENCE_ID', facebookAudienceId), callbackSuccess, callbackError, data, headers, true);
                }, timeout);

            };

            let lineCount = 0;
            let submitList = [];
            for (let line of identities) {
                lineCount += 1;
                submitList.push(line);
                if ((submitList.length == FACEBOOK_UPDATE_CUSTOM_AUDIENCE_PER_TIME) || (lineCount == countValid)) {
                    submitToFacebook(submitList);
                    submitList = [];
                    if (lineCount === countValid)
                        resolve({
                            status: 'success'
                        });
                }
            }
        };

        return new Promise(function (resolve, reject) {
            audienceList.status = STATUS_JOB_LIST.SUBMITTED;
            audienceList.save().then(() => pushUser(resolve, facebookAudienceListId));
        });
    }

    static updateUserRawToFacebook(audience) {
        const {facebookAdAccount, facebookAudienceId, businessId, maskedType, countValid, filePath} = audience;
        const ad_account_id = facebookAdAccount;
        const access_token = FACEBOOK_BUSINESS_ACCESS_TOKEN[businessId.toUpperCase()];
        Utils.logToFileForAudience(`Update users ${facebookAudienceId}`)
        const submitToFacebook = function (users) {
            Utils.logToFileForAudience(`Submit ${users.length} users to ${facebookAudienceId}`)
            const data = {
                access_token,
                payload: {
                    "schema": FB_AUDIENCE_HASH_TYPE_MAPPING[maskedType],
                    "data": users
                }
            };
            const headers = {'Content-type': 'application/json'};
            const callbackSuccess = (result) => {
                let message = 'Session: ' + result.session_id + ' Updated AudienceID ' + result.audience_id + ' :' + result.num_received;
                if (result.num_invalid_entries > 0)
                    message = message + ' Invalid:' + result.num_invalid_entries + ' Invalid sample:' + JSON.stringify(result.invalid_entry_samples);
                Utils.logToFileForAudience(message);
            };

            const callbackError = (error) => {
                Utils.logErrorToFileForAudience(JSON.stringify(error.response.data.error));
                resolve({
                    status: 'failed',
                    message: JSON.stringify(error.response.data.error)
                });
            };

            Utils.logToFileForAudience(`Post data to ${facebookAudienceId}`)
            const maxTimeOut = countValid * 0.45;
            const minTimeOut = 3000;
            const timeout = Math.floor(Math.random() * (maxTimeOut - minTimeOut)) + minTimeOut;
            setTimeout(() => {
                Utils.makeHttpRequest('post', FACEBOOK_API.UPDATE_CUSTOM_AUDIENCE.replace(':CUSTOM_AUDIENCE_ID', facebookAudienceId), callbackSuccess, callbackError, data, headers, true);
            }, timeout);
        };

        const hashingIdentities = function (filePath) {
            let unmaskedUserIdentities = []
            let lineCount = 0;
            return new Promise((resolve, reject) => {
                const lineReader = readline.createInterface({
                    input: fs.createReadStream(filePath)
                });
                lineReader.on('line', function (line) {
                    let result = line.toLowerCase();
                    if (maskedType === 'phone')
                        result = result.replace('+84', '84');
                    const hashedValue = Utils.hashSha256(result);
                    unmaskedUserIdentities.push(hashedValue);
                    if (lineCount % 100000 === 0) Utils.logToFileForAudience(`Hashing ${lineCount} elements`)
                    ++lineCount;
                    if (lineCount === countValid) resolve(unmaskedUserIdentities)
                });
                lineReader.on('close', function () {
                });
            })
        }

        hashingIdentities(filePath).then(identities => {
            Utils.logToFileForAudience(`Ready to submit Facebook Audience ID ${facebookAudienceId}`)
            let lineCount = 0;
            let submitList = [];
            for (let line of identities) {
                lineCount += 1;
                submitList.push(line);
                if ((submitList.length == FACEBOOK_UPDATE_CUSTOM_AUDIENCE_PER_TIME) || (lineCount == identities.length)) {
                    submitToFacebook(submitList);
                    submitList = [];
                    if (lineCount === countValid)
                        resolve({
                            status: 'success'
                        });
                }
            }
        })
    }

    static pushAppEventToFacebook(audienceList, events) {
        const {facebookAppId, countReceived} = audienceList;
        const pushEvent = (resolve) => {
            const submitToFacebook = function (event) {
                const {device_id, Cost} = event;
                event['Cost'] = Utils.convertToUSD(Cost);
                const data = {
                    "event": "CUSTOM_APP_EVENTS",
                    "advertiser_id": device_id,
                    "advertiser_tracking_enabled": 1,
                    "application_tracking_enabled": 1,
                    "custom_events": [
                        {
                            "_eventName": "fb_mobile_purchase",
                            "_valueToSum": event['Cost'],
                            "fb_currency": "USD"
                        }
                    ]
                };
                const headers = {'Content-type': 'application/json'};
                const callbackSuccess = (result) => {
                    Utils.logToFileForAnalyticAppEvent(JSON.stringify(event));
                };
                const callbackError = (error) => {
                    Utils.logErrorToFileForAnalyticAppEvent(JSON.stringify(error));
                    Utils.logErrorToFileForAnalyticAppEvent(JSON.stringify(event));
                    resolve({
                        status: 'failed',
                        message: JSON.stringify(error)
                    });
                };

                const randTime = Utils.generateRandomInteger(30) * 1000;
                setTimeout(() => {
                    Utils.makeHttpRequest('post', FACEBOOK_API.PUSH_APP_EVENT.replace(':APP_ID', facebookAppId), callbackSuccess, callbackError, data, headers, true);
                    Utils.logToFileForAnalyticAppEvent(JSON.stringify(event));
                }, randTime);


            };
            Utils.logToFileForAnalyticAppEvent('----- Start: pushing ' + countReceived + ' events to Facebook');
            var lineCount = 0;
            for (let event of events) {
                lineCount += 1;
                submitToFacebook(event);
                if (lineCount === countReceived) {
                    Utils.logToFileForAnalyticAppEvent('----- Finish: pushing ' + countReceived + ' events to Facebook');
                    resolve({
                        status: 'success'
                    });
                }
            }
        };

        return new Promise(function (resolve, reject) {
            audienceList.status = STATUS_JOB_LIST.SUBMITTED;
            audienceList.save().then(() => pushEvent(resolve));
        });
    }

    static clearUserCustomAudience(audienceId) {
        const access_token = FACEBOOK_BUSINESS_ACCESS_TOKEN[businessId.toUpperCase()];

        const callbackSuccess = (result) => {
            Utils.logToFileForAnalyticAppEvent(JSON.stringify(result));
        };

        const callbackError = (error) => {
            Utils.logErrorToFileForAnalyticAppEvent(JSON.stringify(error));
            Utils.logErrorToFileForAnalyticAppEvent(JSON.stringify(event));
            return ({
                status: 'failed',
                message: JSON.stringify(error)
            });
        };
        const headers = {'Content-type': 'application/json'};
        const data = {
            access_token
        }
        return Utils.makeHttpRequest('delete', FACEBOOK_API.UPDATE_CUSTOM_AUDIENCE.replace(':CUSTOM_AUDIENCE_ID', audienceId), callbackSuccess, callbackError, data, headers, true)
    }

};
