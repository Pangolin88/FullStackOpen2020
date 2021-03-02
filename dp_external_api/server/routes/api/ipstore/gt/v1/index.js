import { Router } from 'express';
import {IP_STORE_SERVICE} from "../../../../../config";
import HttpUtils from "../../../../../extras/HttpUtils";
import Utils from "../../../../../extras/Utils"
import Axios from 'axios';

const router = Router();
const DEPARTMENT = 'GT'
const authorizeHeader = {
    'content-type': "application/json",
    'authorization': IP_STORE_SERVICE.token
}

router.post('/lookup', (req, res) => {
    const ipList = req.body.ipList;
    Utils.logToFile(`INFO: ${DEPARTMENT} POST /lookup ---- Total ip: ${ipList.length}`, 'info', 'ipstore')

    if(!ipList) return HttpUtils.makeErrorResponse(res, 400)

    if(ipList.length > 100) return HttpUtils.makeErrorResponse(res, {message: 'ipList maximum size is 100'}, 400)

    const body = {
        "ip_list": ipList
    }

    HttpUtils.postJson(IP_STORE_SERVICE.url, body, authorizeHeader)
    .then(ip_info => {
        Utils.logToFile(`SUCCESS: ${DEPARTMENT} POST /lookup ---- Total ip: ${ipList.length}`, 'success', 'ipstore' )
        HttpUtils.makeJsonResponse(res, {result: ip_info})
    })
    .catch(err => {
        Utils.logToFile(`ERROR: ${DEPARTMENT} POST /lookup ---- Total ip: ${ipList.length}`, 'error', 'ipstore' )
        HttpUtils.makeErrorResponse(res, 500)
    })
})

export default router;