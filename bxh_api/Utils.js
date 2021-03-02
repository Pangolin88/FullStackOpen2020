import moment from 'moment';
import _ from 'lodash';
import uuid from 'uuid/v1'; // https://www.npmjs.com/package/uuid
import shortid from 'shortid';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import axios from 'axios';
import sha256 from 'sha256';
import querystring from 'query-string';
import jwt from 'jsonwebtoken';
import {
    HTTP_ERROR_CODE,
    JWT_SECRECT,
    LOGS_DIR,
    STATUS_JOB_LIST,
    UNMASKED_DATA_DIR,
    UPLOADED_DATA_DIR,
    USD_EXCHANGE_RATE
} from '../config';


export default class Utils {

    static httpResponse(res, data, code) {
        if (!data)
            data = {};
        if (code)
            res.status(code);
        if (!('errorMessage' in data) && !('message' in data) && !('status' in data))
            data['status'] = 'success';
        return res.json(data);
    }


    static jsonResponse(res, data) {
        if (!data)
            data = {};
        if (!('errorMessage' in data) && !('message' in data) && !('status' in data))
            data['status'] = 'success';
        return res.json(data);
    }


    static errorResponse(res, message, httpCode) {
        return this.httpResponse(res, {errorMessage: message}, httpCode);
    }


    static dateFromText(txt, format) {
        // return new Date(txt);
        return moment(new Date(txt));
        // if (!format)
        //     format = 'YYYY-MM-DD';
        // console.log(format);
        // return moment(txt).format(format);
    }


    static dateToString(dateObj, format) {
        if (!format)
            format = 'YYYY-MM-DD';
        return moment(dateObj).format(format);
    }


    static nowDate() {
        return moment();
    }


    static yesterday() {
        return moment().subtract(1, 'days');
    }


    static replaceAll(replaced_str, pattern1, pattern2) {
        return replaced_str.split(pattern1).join(pattern2);
    }

    static safeGet(obj, keyList, defaultVal) {
        let defaultValue = defaultVal ? defaultVal : null;
        return _.get(obj, keyList, defaultValue);
    };

    static cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj))
    };

    static isEmptyObject(obj) {
        return _.isEmpty(obj);
    }

    static generateUUID() {
        return uuid()
    }

    static generateShortUUID() {
        return shortid.generate();
    }

    static generateModelId() {
        return this.generateUUID() + '-' + this.generateShortUUID();
    }

    static writeArrayToFile(filePath, dataList) {
        const f = fs.createWriteStream(filePath, {flags: 'a'});
        f.write(dataList.join('\n') + '\n');
    }


    static buildUploadFilePath(fileName) {
        return path.join(UPLOADED_DATA_DIR, fileName + '.txt');
    }

    static buildUnmaskedDataFile(fileName) {
        return path.join(UNMASKED_DATA_DIR, fileName + '.txt');
    }


    static makeHttpRequest(methodOriginal, urlOriginal, callbackSuccess, callbackError, data, customHeaders, doNotStringyfyData) {
        const method = methodOriginal.toLowerCase();
        var url = urlOriginal;
        var config = {
            method: method,
            url: url
        };
        // https://timonweb.com/posts/make-drf-and-axios-work-nicely-together/
        if (data) {
            if (doNotStringyfyData)
                config['data'] = data;
            else {
                const paramsTxt = querystring.stringify(data);
                if (method === 'get')
                    config['url'] = url + '?' + paramsTxt;
                else if (method === 'post')
                    config['data'] = paramsTxt; // for django backend
            }
        }
        var headers = {'Content-type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'};
        if (customHeaders)
            headers = customHeaders;
        config['headers'] = headers;
        axios(config).then(
            function (res) {
                return callbackSuccess(res.data);
            },
            function (err) {
                return callbackError(err);
            }
        )
    }

    static countLinesInFile(fileName, callback) {
        child_process.exec('wc -l < ' + fileName, function (error, results) {
            if (error)
                return callback(null);
            return callback(parseInt(results.replace('\n', '')));
        });
    }


    static validateEmpty(arr, obj) {
        for (let field of arr) {
            if ((obj[field] === undefined) || (obj[field] === null)) {
                return 'Empty ' + field;
            }
        }
        ;
        return null;
    }


    static hashSha256(text) {
        try {
            return sha256(text);
        } catch (err) {
            return null;
        }
    }


    static nowDateInText(formatTxt) {
        if (!formatTxt)
            formatTxt = 'YYYY-MM-DD-HH-mm-ss';
        return moment().format(formatTxt);
    }


    static logToFile(message, type, logType) {
        if (!type)
            type = 'info';
        const today = this.nowDateInText('YYYY-MM-DD');
        const filePath = path.join(LOGS_DIR, logType, type + '-' + today + '.txt');
        console.log(filePath)
        fs.appendFile(filePath, this.nowDate().toISOString() + ' ' + message + '\n', (err) => {});
    }

    static logToFileByHour(message, type, logType) {
        if (!type)
            type = 'info';
        const currentHour = this.nowDateInText('YYYY-MM-DD--HH');
        const filePath = path.join(LOGS_DIR, logType, type + '-' + currentHour + '.txt');
        fs.appendFile(filePath, this.nowDate().toISOString() + ' ' + message + '\n', (err) => {});
    }

    static logToFileForAudience(message) {
        this.logToFile(message, 'info', 'audience');
    }

    static logErrorToFileForAudience(message) {
        this.logToFile(message, 'error', 'audience');
    }

    static logToFileForTableau(message) {
        this.logToFile(message, 'info', 'tableau')
    }

    static logErrorToFileForTableau(message) {
        this.logToFile(message, 'error', 'tableau')
    }


    static logToFileForAnalyticAppEvent(message) {
        this.logToFileByHour(message, 'info', 'analytic');
    }

    static logErrorToFileForAnalyticAppEvent(message) {
        this.logToFileByHour(message, 'error', 'analytic');
    }

    static logStatsToFileForAnalyticAppEvent(message) {
        this.logToFileByHour(message, 'stats', 'analytic');
    }


    static writeDataToFile(objecModel, objectKey, req, res) {
        const {list_id} = req.body;
        let objects = req.body[objectKey];
        if (objectKey === 'events') {
            let objectsTmp = [];
            for (let event of objects)
                objectsTmp.push(JSON.stringify(event))
            objects = objectsTmp;
        }
        const errorMessage = this.validateEmpty(['list_id', objectKey], req.body);
        if (errorMessage)
            return this.errorResponse(res, errorMessage, HTTP_ERROR_CODE.BAD_REQUEST);


        objecModel.findByListId(list_id, STATUS_JOB_LIST.INIT, (audienceList) => {
            if (!audienceList)
                return this.errorResponse(res, 'Invalid list_id', HTTP_ERROR_CODE.NOT_FOUND);
            this.writeArrayToFile(Utils.buildUploadFilePath(list_id), objects);
            return this.jsonResponse(res, {
                list_id: list_id,
                received: objects.length
            });
        });
    }


    static convertToUSD(cost) {
        return ((cost * 100) / USD_EXCHANGE_RATE).toFixed(2);
    }

    static generateRandomInteger(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static async decodeToken(token) {
        try {
            return await jwt.verify(token, JWT_SECRECT);
        } catch (e) {
            throw new Error('Your Session expired. Sign in again');
        }

    }

    static async createToken(key, department) {
        let credential = {};
        credential[key] = department
        return await jwt.sign({...credential}, JWT_SECRECT);
    }

    static getDateArray = function(start, end) {
        let arr = [];
        let dt = new Date(start);
        while (dt <= end) {
            arr.push((new Date(dt)).toISOString().substring(0, 10));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }

}
