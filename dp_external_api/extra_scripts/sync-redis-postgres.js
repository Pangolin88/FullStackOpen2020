// var axios = require('axios');
// var utils = require('../server/extras/Utils');
const fs = require('fs');
import { Utils } from '../server/extras';
import path from 'path';


const BACKEND_URL = 'http://localhost:5050';

const ACTION = {
    UN_MASK: '/dal/v1.2/facebook/unmaskingCustomAudience'
};

const HEADERS = {'Content-type': 'application/json', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBhcnRtZW50IjoiZGFsIiwiaWF0IjoxNTU4MTczMTM3fQ.M9K5vRTOZBPiPrn0eOerJNaewHhpNv79TZJW2iDefcg'};

function buildURL(action){
    return BACKEND_URL + action;
}


function doAction(callback) {
    const filePath = `/home/anhpq2/webapps/dp_external_api/vng_vdp_external_sns_collaboration_uploaded_data/2020-05-27_13-37-52__fb_audience_list__device_id__by_trungnd3@vng.com.vn__MxNjAqEnIx9.txt`;
    const data = {
        maskedType: 'device_id',
        filePath
    };

    const callbackSuccess = function (result){
        callback(result);
    };
    const callbackError = function (error){
        console.log(error);
    };

    Utils.makeHttpRequest('get', buildURL(ACTION.UN_MASK), callbackSuccess, callbackError, data, HEADERS);
}

doAction(res => console.log(res))