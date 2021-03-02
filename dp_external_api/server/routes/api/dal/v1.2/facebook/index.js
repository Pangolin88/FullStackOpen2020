import FacebookService from "../../../../../extras/v1.2/FacebookService";
import {Router} from 'express';
import {Utils} from '../../../../../extras';
import {FacebookAnalyticAppEvent, FacebookAudienceList} from '../../../../../models';
import {
    FACEBOOK_APP_ID_LIST,
    FACEBOOK_BUSINESS_ACCESS_TOKEN_V4_0,
    FB_DESTINATION_TYPE,
    HTTP_ERROR_CODE,
    MASKED_IDENTITY_TYPE,
    STATUS_JOB_LIST,
    ACTION_TYPE
} from '../../../../../config';

const router = Router();


// -------- Facebook Custom Audience List --------------
router.get('/createCustomAudience', (req, res) => {
    const {creator, business_id, identity_type, fb_type, fb_list_name, fb_ad_account_id} = req.query;
    let errorMessage = Utils.validateEmpty(['creator', 'identity_type', 'business_id', 'fb_type', 'fb_list_name', 'fb_ad_account_id'], req.query);
    if (!errorMessage) {
        if (!FB_DESTINATION_TYPE.includes(fb_type))
            errorMessage = 'Invalid fb_type';
        else if (!MASKED_IDENTITY_TYPE.includes(identity_type))
            errorMessage = 'Invalid identity_type';
        else if (!(business_id.toUpperCase() in FACEBOOK_BUSINESS_ACCESS_TOKEN_V4_0))
            errorMessage = 'Business ID was not predefined';
    }
    if (errorMessage)
        return Utils.errorResponse(res, errorMessage, HTTP_ERROR_CODE.BAD_REQUEST);

    const userListId = [Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH-mm-ss'), fb_type, identity_type, 'by_' + creator, Utils.generateShortUUID()].join('__');
    const data = {
        creator,
        businessId: business_id,
        maskedType: identity_type,
        storedFileName: userListId,
        facebookType: fb_type,
        facebookAudienceListName: fb_list_name,
        facebookAdAccountId: fb_ad_account_id,
        created_date: Utils.nowDate()
    };
    FacebookAudienceList.create(data).then((fbList) => {
        return Utils.jsonResponse(res, {list_id: userListId});
    });
});


router.post('/createCustomAudience', (req, res) => {
    return Utils.writeDataToFile(FacebookAudienceList, 'identities', req, res);
});


router.put('/createCustomAudience', (req, res) => {
    const {list_id, callback} = req.body;
    const errorMessage = Utils.validateEmpty(['list_id', 'callback'], req.body);
    if (errorMessage)
        return Utils.errorResponse(res, errorMessage, HTTP_ERROR_CODE.BAD_REQUEST);

    FacebookAudienceList.findByListId(list_id, STATUS_JOB_LIST.INIT, (audienceList) => {
        if (!audienceList)
            return Utils.errorResponse(res, 'Invalid list ID', HTTP_ERROR_CODE.NOT_FOUND);

        Utils.countLinesInFile(Utils.buildUploadFilePath(list_id), (totalLines) => {
            if (!totalLines && (totalLines !== 0))
                return Utils.errorResponse(res, 'Can not process list ID: ' + list_id, HTTP_ERROR_CODE.SERVER_ERROR);
            audienceList.countReceived = totalLines;
            audienceList.dalCallback = callback;
            audienceList.status = STATUS_JOB_LIST.PROCESSING;
            audienceList.save().then((audienceListUpdated) => {
                Utils.logToFileForAudience('-----------UNMASKING DATA------------')
                FacebookService.unmaskingData(audienceListUpdated)
                    .then((identities) => {
                        Utils.logToFileForAudience('-----------PUSH TO FACEBOOK------------')
                        FacebookService.pushUserToFacebook(audienceListUpdated, identities).then((result) => {
                            let dataToDAL = {};
                            if (result.status === 'success') {
                                dataToDAL = {
                                    facebook_audience_id: audienceListUpdated.facebookAudienceListId,
                                    total_submitted: audienceListUpdated.countValid,
                                    preview: audienceListUpdated.preview
                                };
                            } else {
                                dataToDAL = result;
                                Utils.logErrorToFileForAudience('Cannot push to Facebook ' + JSON.stringify(result));
                            }

                            const callbackSuccess = (response) => {
                                Utils.logToFileForAudience('Calling to DAL callback with data: ' + JSON.stringify(dataToDAL));
                                Utils.logToFileForAudience('Result: ' + JSON.stringify(response));
                            };
                            const callbackError = (error) => {
                                Utils.logErrorToFileForAudience('Error when calling to DAL callback with data: ' + JSON.stringify(dataToDAL));
                                Utils.logErrorToFileForAudience(error);
                            };
                            Utils.makeHttpRequest('get', audienceListUpdated.dalCallback, callbackSuccess, callbackError, dataToDAL);
                        });
                    });
                return Utils.jsonResponse(res, {
                    list_id: list_id,
                    received: totalLines
                });
            });
        });

    });
});

router.get('/updateCustomAudience', (req, res) => {
    const {creator, business_id, identity_type, fb_ad_account_id, fb_audience_list_id} = req.query;
    let errorMessage = Utils.validateEmpty(['creator', 'identity_type', 'business_id', 'fb_ad_account_id', 'fb_audience_list_id'], req.query);
    if (!errorMessage) {
        if (!MASKED_IDENTITY_TYPE.includes(identity_type))
            errorMessage = 'Invalid identity_type';
        else if (!(business_id.toUpperCase() in FACEBOOK_BUSINESS_ACCESS_TOKEN_V4_0))
            errorMessage = 'Business ID was not predefined';
    }
    if (errorMessage)
        return Utils.errorResponse(res, errorMessage, HTTP_ERROR_CODE.BAD_REQUEST);

    const userListId = [Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH-mm-ss'), 'update', identity_type, 'by_' + creator, Utils.generateShortUUID()].join('__');
    const data = {
        creator,
        businessId: business_id,
        maskedType: identity_type,
        storedFileName: userListId,
        facebookAdAccountId: fb_ad_account_id,
        facebookAudienceListId: fb_audience_list_id,
        type: ACTION_TYPE.UPDATE,
        created_date: Utils.nowDate()
    };
    FacebookAudienceList.create(data).then((fbList) => {
        return Utils.jsonResponse(res, {list_id: userListId});
    });
});

router.post('/updateCustomAudience', (req, res) => {
    return Utils.writeDataToFile(FacebookAudienceList, 'identities', req, res);
});

router.put('/updateCustomAudience', (req, res) => {
    const {list_id, callback} = req.body;
    const errorMessage = Utils.validateEmpty(['list_id', 'callback'], req.body);
    if (errorMessage)
        return Utils.errorResponse(res, errorMessage, HTTP_ERROR_CODE.BAD_REQUEST);

    FacebookAudienceList.findByListId(list_id, STATUS_JOB_LIST.INIT, (audienceList) => {
        if (!audienceList)
            return Utils.errorResponse(res, 'Invalid list ID', HTTP_ERROR_CODE.NOT_FOUND);

        Utils.countLinesInFile(Utils.buildUploadFilePath(list_id), (totalLines) => {
            if (!totalLines && (totalLines !== 0))
                return Utils.errorResponse(res, 'Can not process list ID: ' + list_id, HTTP_ERROR_CODE.SERVER_ERROR);
            audienceList.countReceived = totalLines;
            audienceList.dalCallback = callback;
            audienceList.status = STATUS_JOB_LIST.PROCESSING;
            audienceList.save().then((audienceListUpdated) => {
                FacebookService.unmaskingData(audienceListUpdated)
                    .then((identities) => {
                        FacebookService.updateUserToFacebook(audienceListUpdated, identities).then((result) => {
                            let dataToDAL = {};
                            if (result.status === 'success') {
                                dataToDAL = {
                                    facebook_audience_id: audienceListUpdated.facebookAudienceListId,
                                    total_submitted: audienceListUpdated.countValid,
                                    preview: audienceListUpdated.preview
                                };
                            } else {
                                dataToDAL = result;
                                Utils.logErrorToFileForAudience('Cannot update to Facebook ' + JSON.stringify(result));
                            }

                            const callbackSuccess = (response) => {
                                Utils.logToFileForAudience('Calling to DAL callback with data: ' + JSON.stringify(dataToDAL));
                                Utils.logToFileForAudience('Result: ' + JSON.stringify(response));
                            };
                            const callbackError = (error) => {
                                Utils.logErrorToFileForAudience('Error when calling to DAL callback with data: ' + JSON.stringify(dataToDAL));
                                Utils.logErrorToFileForAudience(error);
                            };
                            Utils.makeHttpRequest('get', audienceListUpdated.dalCallback, callbackSuccess, callbackError, dataToDAL);
                        });
                    });
                return Utils.jsonResponse(res, {
                    list_id: list_id,
                    received: totalLines
                });
            });
        });

    });
})

router.delete('/clearCustomAudience', (req, res) => {
    const { business_id, fb_audience_list_id, callback } = req.query;
    let errorMessage = Utils.validateEmpty(['business_id', 'fb_audience_list_id'], req.query);
    if (!errorMessage) {
         if (!(business_id.toUpperCase() in FACEBOOK_BUSINESS_ACCESS_TOKEN_V4_0))
                errorMessage = 'Business ID was not predefined';
    }

    if (errorMessage)
        return Utils.errorResponse(res, errorMessage, HTTP_ERROR_CODE.BAD_REQUEST);

    FacebookService.clearUserCustomAudience(fb_audience_list_id).then(result => {
        const callbackSuccess = (response) => {
            Utils.logToFileForAudience('Calling to DAL callback with data: ' + JSON.stringify({fb_audience_list_id}));
            Utils.logToFileForAudience('Result: ' + JSON.stringify(response));
        };
        const callbackError = (error) => {
            Utils.logErrorToFileForAudience('Error when calling to DAL callback with data: ' + JSON.stringify(fb_audience_list_id));
            Utils.logErrorToFileForAudience(error);
        };
        const dataToDAL = {
            status: 'success',
            'fb_audience_list_id': fb_audience_list_id,
        }
        Utils.makeHttpRequest('get', callback, callbackSuccess, callbackError, JSON.stringify(dataToDAL));
    })
})

router.get('/unmaskingCustomAudience', (req, res) => {
    const filePath = req.query.filePath;
    const maskedType = req.query.maskedType;
    FacebookService.unMaskFileToFile(filePath, maskedType).then(() => {
    });
    res.send("Processing")
})

router.get('/unmaskingFile', (req, res) => {
    const filePath = req.query.filePath;
    const maskedType = req.query.maskedType;
    FacebookService.unMaskFile(filePath, maskedType).then(() => {
    });
    res.send("Processing")
})


router.get('/dalCallback', (req, res) => {
    return Utils.jsonResponse(res, {
        message: 'success'
    });
});

// -------- Facebook Custom Audience List : END --------------


// -------- Facebook Analytic: App Event --------------

router.get('/createAnalyticAppEvent', (req, res) => {
    const {business_id, game_id, identity_type} = req.query;
    const fb_type = 'analytic';
    let BID = '';
    let GID = '';
    let errorMessage = Utils.validateEmpty(['business_id', 'game_id', 'identity_type'], req.query);
    if (!errorMessage) {
        BID = business_id.toUpperCase();
        GID = game_id.toUpperCase();
        if (!MASKED_IDENTITY_TYPE.includes(identity_type))
            errorMessage = 'Invalid identity_type';
        else if (!(BID in FACEBOOK_APP_ID_LIST))
            errorMessage = 'Business ID was not predefined';
        else if (!(GID in FACEBOOK_APP_ID_LIST[BID]))
            errorMessage = 'Game ID was not predefined';
    }
    if (errorMessage)
        return Utils.errorResponse(res, errorMessage, HTTP_ERROR_CODE.BAD_REQUEST);

    const userListId = [Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH-mm-ss'), fb_type, BID, GID, identity_type, Utils.generateShortUUID()].join('__');
    const data = {
        businessId: business_id,
        gameId: game_id,
        maskedType: identity_type,
        storedFileName: userListId,
        facebookAppId: FACEBOOK_APP_ID_LIST[BID][GID],
        created_date: Utils.nowDate()
    };
    FacebookAnalyticAppEvent.create(data).then((fbList) => {
        return Utils.jsonResponse(res, {list_id: userListId});
    });
});


router.post('/createAnalyticAppEvent', (req, res) => {
    return Utils.writeDataToFile(FacebookAnalyticAppEvent, 'events', req, res);
});


router.put('/createAnalyticAppEvent', (req, res) => {
    const {list_id} = req.body;
    const errorMessage = Utils.validateEmpty(['list_id'], req.body);
    if (errorMessage)
        return Utils.errorResponse(res, errorMessage, HTTP_ERROR_CODE.BAD_REQUEST);

    FacebookAnalyticAppEvent.findByListId(list_id, STATUS_JOB_LIST.INIT, (audienceList) => {
        if (!audienceList)
            return Utils.errorResponse(res, 'Invalid list ID', HTTP_ERROR_CODE.NOT_FOUND);

        Utils.countLinesInFile(Utils.buildUploadFilePath(list_id), (totalLines) => {
            if (!totalLines && (totalLines !== 0))
                return Utils.errorResponse(res, 'Can not process list ID: ' + list_id, HTTP_ERROR_CODE.SERVER_ERROR);
            audienceList.countReceived = totalLines;
            audienceList.status = STATUS_JOB_LIST.PROCESSING;
            audienceList.save().then((audienceListUpdated) => {
                FacebookService.readFileContent(audienceListUpdated)
                    .then((events) => {
                        FacebookService.pushAppEventToFacebook(audienceListUpdated, events).then((result) => {
                            if (result.status === 'success') {
                                Utils.logToFileForAnalyticAppEvent('Finish pushing App Event');
                                Utils.logStatsToFileForAnalyticAppEvent('type="analytic_app_event" business_id="' + audienceListUpdated.businessId +
                                    '" game_id="' + audienceListUpdated.gameId + '" count="' + audienceListUpdated.countReceived + '"');
                            } else
                                Utils.logErrorToFileForAnalyticAppEvent('Cannot push to Facebook ' + JSON.stringify(result));
                        });
                    });
                return Utils.jsonResponse(res, {
                    list_id: list_id,
                    received: totalLines
                });
            });
        });

    });
});

export default router;



