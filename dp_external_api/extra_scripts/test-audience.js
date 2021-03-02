// var axios = require('axios');
// var utils = require('../server/extras/Utils');

import { Utils } from '../server/extras';



const BACKENED_URL = 'http://localhost:3002';
const DAL_CALLBACK = 'http://localhost:3002/facebook/dalCallback';

const ACTION = {
    INIT: '/facebook/createCustomAudience',
    POST: '/facebook/createCustomAudience',
    FINALIZE: '/facebook/createCustomAudience'
};

const CREATOR = 'thanhpn3';
const BUSINESS_ID = 'pg3';
const IDENTITY_TYPE = 'device_id';
const FB_TYPE = 'fb_audience_list';
const FB_AD_ACCOUNT_ID = '1542392359170236';
const HEADERS = {'Content-type': 'application/json'};
const IDENTITIES = ["110662602", "107658993", "107022681", "108270445", "107658665", "15030740", "15042842", "99682299", "111045824", "99682381"];

function buildURL(action){
    return BACKENED_URL + action;
};


function initList(callback){
    const data = {
        creator: CREATOR,
        identity_type: IDENTITY_TYPE,
        business_id: BUSINESS_ID,
        fb_type: FB_TYPE,
        fb_list_name: 'thanhpn3 testing',
        fb_ad_account_id: FB_AD_ACCOUNT_ID
    };
    const callbackSuccess = function (result){
        callback(result.list_id);
    };
    const callbackError = function (error){
        console.log(error);
    };
    Utils.makeHttpRequest('get', buildURL(ACTION.INIT), callbackSuccess, callbackError, data, HEADERS);
};


async function postList(list_id, callback){
    const data = {
        list_id,
        identities: IDENTITIES
    };
    const callbackSuccess = function (result){
        console.log('postList: received '+result.received);
    };
    const callbackError = function (error){
        console.log(error);
    };
    for (let i=0; i< 3; i++) {
        await Utils.makeHttpRequest('post', buildURL(ACTION.POST), callbackSuccess, callbackError, data, HEADERS, true);
    }
    callback(list_id);
}


function finalize(list_id) {
    const data = {
        list_id,
        callback: DAL_CALLBACK
    };
    const callbackSuccess = function (result){
        console.log(result);
    };
    const callbackError = function (error){
        console.log(error);
    };
    Utils.makeHttpRequest('put', buildURL(ACTION.FINALIZE), callbackSuccess, callbackError, data, HEADERS, true);
}

initList((list_id) => {
    postList(list_id, (new_list_id) => {
        finalize(new_list_id)
        // console.log('finish, but not finalize')
    });
});