const router = require('express').Router()
const { Pool } = require('pg')
const moment = require('moment')
const path = require('path')

const pool = new Pool({
  host: '127.0.0.1',
  port: '5433',
  database: 'tmdl',
  user: 'postgres'
})

const httpResponse = (res, data, code) => {
        if (!data)
            data = {};
        if (code)
            res.status(code);
        if (!('errorMessage' in data) && !('message' in data) && !('status' in data))
            data['status'] = 'success';
        return res.json(data);
    }

const nowDateInText = (formatTxt) => {
        if (!formatTxt)
            formatTxt = 'YYYY-MM-DD-HH-mm-ss';
        return moment().format(formatTxt);
    }

const jsonResponseUtils = (res, data) => {
        if (!data)
            data = {};
        if (!('errorMessage' in data) && !('message' in data) && !('status' in data))
            data['status'] = 'success';
        return res.json(data);
    }

const dateToStringUtils = (dateObj, format) => {
        if (!format)
            format = 'YYYY-MM-DD';
        return moment(dateObj).format(format);
    }

const nowDateUtils = () => {
        return moment();
    }

const logToFileUtils = (message, type, logType) => {
        console.log(message, type, logType)
        // if (!type)
        //     type = 'info';
        // const today = nowDateInText('YYYY-MM-DD');
        // const filePath = path.join(LOGS_DIR, logType, type + '-' + today + '.txt');
        // console.log(filePath)
        // fs.appendFile(filePath, this.nowDate().toISOString() + ' ' + message + '\n', (err) => {});
    }

const errorResponseUtils = (res, message, httpCode) => {
        return httpResponse(res, {errorMessage: message}, httpCode);
    }

const jsonResponse = (res, err, results) => {
    if (!err) {
        jsonResponseUtils(res, results.rows);
        const logFile = dateToStringUtils(nowDateUtils, 'YYYY-MM-DD_HH');
        logToFileUtils(
            ' --Result-- ' + JSON.stringify(results.rows),
            logFile,
            'gs5_pwm_sea_results'
        );
    } else {
       logToFileUtils(JSON.stringify(err), 'error', 'gs5');
       errorResponseUtils(res, err);
    }
}

const CONDITION = '#CONDITION#';
const DS = '#DS#';
const unionRankQuery = `SELECT guildname, serverid, logtime, rankvalue
FROM unionrank as r
LEFT JOIN servers s ON s.server_id = r.serverid
WHERE ds = '${DS}' ${CONDITION}
ORDER BY rankvalue DESC
LIMIT 100;`

const roleRankQuery = `SELECT rolename, serverid, occupation, logtime, rankvalue
FROM rank as r
LEFT JOIN servers s ON s.server_id = r.serverid
LEFT JOIN occupations o ON o.occupation_id = r.occupation
WHERE ds = '${DS}' ${CONDITION}
ORDER BY rankvalue DESC
LIMIT 100;`

router.get('/unionrank', (req, res) => {
    let ds = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const params = req.query;
    const server = params['server'];
    let where = " "
    if (server) where += `AND (CAST(s.server_id AS TEXT) = '${server}' OR s.server_name = '${server}') `;
    let query = unionRankQuery
        .replace(DS, params['date'] || ds)
        .replace(CONDITION, where);
    pool.query(query, (err, results) => jsonResponse(res, err, results))
});

router.get('/rolerank', (req, res) => {
    let ds = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const params = req.query;
    const server = params['server'];
    const occupation = params['occupation'];
    let where = " "
    if (server) where += `AND (CAST(s.server_id AS TEXT) = '${server}' OR s.server_name = '${server}') `;
    if (occupation) where += `AND (CAST(o.occupation_id AS TEXT) = '${occupation}' OR o.occupation_name = '${occupation}') `;
    let query = roleRankQuery
        .replace(DS, params['date'] || ds)
        .replace(CONDITION, where);
    pool.query(query, (err, results) => jsonResponse(res, err, results))
});

router.get('/servers', (req, res) => {
    const query = 'SELECT server_id, server_name FROM servers WHERE is_active = true ';
    pool.query(query, (err, results) => jsonResponse(res, err, results))
});

router.get('/occupations', (req, res) => {
    const query = 'SELECT occupation_id, occupation_name FROM occupations WHERE is_active = true ';
    pool.query(query, (err, results) => jsonResponse(res, err, results))
});

router.get('/info', (request, response) => {
  response.json({
    game: 'TMDL',
    department: 'GS9'
  })
})

module.exports = router
