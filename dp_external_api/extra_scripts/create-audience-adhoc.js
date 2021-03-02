// var axios = require('axios');
// var utils = require('../server/extras/Utils');
const fs = require('fs');
import { Utils } from '../server/extras';
import path from 'path';


const BACKEND_URL = 'http://localhost:5050/dal/v1.1';
const DAL_CALLBACK = 'http://10.50.65.12:8081/v1/api/ua/userdevices/jobs/309/status';

const ACTION = {
    INIT: '/facebook/createCustomAudience',
    POST: '/facebook/createCustomAudience',
    FINALIZE: '/facebook/createCustomAudience'
};

const INPUT_DATA_DIR = path.join(__dirname, '../');

const CREATOR = 'anhpq2@vng.com.vn';
const BUSINESS_ID = 'GS2';
const IDENTITY_TYPE = 'device_id';
const FB_TYPE = 'fb_audience_list';
const FB_AD_ACCOUNT_ID = '1234660323317735';
const HEADERS = {'Content-type': 'application/json', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBhcnRtZW50IjoiZGFsIiwiaWF0IjoxNTU4MTczMTM3fQ.M9K5vRTOZBPiPrn0eOerJNaewHhpNv79TZJW2iDefcg'};

// Read input file
const IDENTITIES = [] //fs.readFileSync(INPUT_DATA_DIR + 'data_1t5.txt').toString().split("\n");
// IDENTITIES.forEach(function (element) {
//     console.log(element);
// });
//const IDENTITIES = ["110662602", "107658993", "107022681", "108270445", "107658665", "15030740", "15042842", "99682299", "111045824", "99682381"];

function buildURL(action){
    return BACKEND_URL + action;
}


function initList(callback){
    const data = {
        creator: CREATOR,
        identity_type: IDENTITY_TYPE,
        business_id: BUSINESS_ID,
        fb_type: FB_TYPE,
        fb_list_name: 'GS2_AllApps_TotalUsers_From1_D365',
        fb_ad_account_id: FB_AD_ACCOUNT_ID
    };
    const callbackSuccess = function (result){
        callback(result.list_id);
    };
    const callbackError = function (error){
        console.log(error);
    };
    Utils.makeHttpRequest('get', buildURL(ACTION.INIT), callbackSuccess, callbackError, data, HEADERS);
}


function postList(list_id, callback){
    const callbackSuccess = function (result){
        console.log('postList: received '+result.received);
        callback(list_id)
    };
    const callbackError = function (error){
        console.log(error);
    };

    const data = {
        list_id,
        identities: IDENTITIES
    };

    Utils.makeHttpRequest('post', buildURL(ACTION.POST), callbackSuccess, callbackError, data, HEADERS, true)

}


function finalize(list_id) {
    const data = {
        list_id,
        callback: DAL_CALLBACK
    };
    const callbackSuccess = function (result){
        console.log(result)
    };
    const callbackError = function (error){
        console.log(error);
    };
    Utils.makeHttpRequest('put', buildURL(ACTION.FINALIZE), callbackSuccess, callbackError, data, HEADERS, true);
}

finalize('2019-10-18_11-32-51__fb_audience_list__device_id__by_ngocttk@vng.com.vn__SRt-JxLRmf')