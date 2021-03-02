import { Utils } from '../server/extras';

const BACKENED_URL = 'http://localhost:3002';

const ACTION = {
    INIT: '/facebook/createAnalyticAppEvent',
    POST: '/facebook/createAnalyticAppEvent',
    FINALIZE: '/facebook/createAnalyticAppEvent'
};

const BUSINESS_ID = 'pg3';
const GAME_ID = 'tsq';
const IDENTITY_TYPE = 'device_id';
const HEADERS = {'Content-type': 'application/json'};
// const EVENTS = [{"device_id":"EE6BED4C-BA7F-4A46-BD6F-3C0FB36BFD3B","Cost":116000.0},{"device_id":"BE347EF1-3087-4AEF-9939-DF84F164B7CD","Cost":23200.0}];
const EVENTS = [
        {"device_id":"EE6BED4C-BA7F-4A46-BD6F-3C0FB36BFD3B","Cost":116000.0},
        {"device_id":"BE347EF1-3087-4AEF-9939-DF84F164B7CD","Cost":23200.0},
        {"device_id":"1DBC0867-12E7-49C9-9803-23D752B2C4FB","Cost":23200.0},
        {"device_id":"3891503a-7f5b-4760-87b2-6fe20693befd","Cost":4640.0},
        {"device_id":"29FCCE12-F547-47DE-98E1-8BD4560C9CA2","Cost":46400.0},
        {"device_id":"2aab0f62-7aff-4fd5-a764-91819f6733cd","Cost":23200.0},
        {"device_id":"3809ae34-a3f2-4011-b16b-55366f084a71","Cost":11600.0},
        {"device_id":"e3aa813c-31e0-4753-b926-c5ff2ad1f0ff","Cost":116000.0},
        {"device_id":"a42c0b97-9afa-4c41-8ca3-79552e1040f9","Cost":23200.0},
        {"device_id":"8e86d86b-9333-4755-a8f8-9a339645c0e7","Cost":4640.0},
        {"device_id":"03803eb0-157e-47df-9f2f-dfd334c9a5ba","Cost":11600.0},
        {"device_id":"1B0C0F2D-DC0B-4332-8141-2F8DBBE39F57","Cost":23200.0},
        {"device_id":"fee94a61-53cf-49e7-adeb-3da0f30be9c1","Cost":4640.0},
        {"device_id":"8F3BCA33-2A91-41F9-B70B-5210387D2C5E","Cost":23200.0},
        {"device_id":"370a6d36-4f84-4e90-809a-9b134e737728","Cost":23200.0},
        {"device_id":"F3DE1542-1B44-438D-9136-040634C1F39F","Cost":23200.0},
        {"device_id":"90d8ce60-fda8-48ee-b4c8-945448e6a7a8","Cost":4640.0},
        {"device_id":"dca4a7c8-9e0a-499f-a779-d6629f3c1bff","Cost":23200.0},
        {"device_id":"7B2B0424-C198-4E9C-98C6-0A1F4BC41213","Cost":11600.0},
        {"device_id":"2aab0f62-7aff-4fd5-a764-91819f6733cd","Cost":4640.0},
        {"device_id":"1b938c88-7093-44d7-9007-41f8ee3a055d","Cost":11600.0},
        {"device_id":"aed9e699-0b1c-4a35-a7db-b182e5971af4","Cost":11600.0},
        {"device_id":"2aab0f62-7aff-4fd5-a764-91819f6733cd","Cost":4640.0},
        {"device_id":"8F3BCA33-2A91-41F9-B70B-5210387D2C5E","Cost":46400.0},
        {"device_id":"4e35b313-4a2c-4d20-95d8-21426f62ef5c","Cost":23200.0},
        {"device_id":"E8CD6C22-06DF-4E77-900C-A603C1605F44","Cost":4640.0},
        {"device_id":"4d79b09e-e32d-4230-af9d-686a53056e46","Cost":116000.0},
        {"device_id":"992678F4-615E-40E6-BD4B-A71E9304C41E","Cost":464000.0}
    ];

function buildURL(action){
    return BACKENED_URL + action;
};


function initList(callback){
    const data = {
        business_id: BUSINESS_ID,
        game_id: GAME_ID,
        identity_type: IDENTITY_TYPE
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
        events: EVENTS
    };
    const callbackSuccess = function (result){
        console.log('postList: received '+result.received);
    };
    const callbackError = function (error){
        console.log(error);
    };
    for (let i=0; i< 1; i++) {
        await Utils.makeHttpRequest('post', buildURL(ACTION.POST), callbackSuccess, callbackError, data, HEADERS, true);
    }
    callback(list_id);
}


function finalize(list_id) {
    const data = {
        list_id
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
    });
});