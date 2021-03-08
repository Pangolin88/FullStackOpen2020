const router = require('express').Router()
const { Pool } = require('pg')
const moment = require('moment')
const path = require('path')

const pool = new Pool({
  host: '127.0.0.1',
  port: '5433',
  database: 'jx1m',
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
            'gs1_jx1m_results'
        );
    } else {
       logToFileUtils(JSON.stringify(err), 'error', 'gs5');
       errorResponseUtils(res, err);
    }
}

const KINID = '#KINID#';
const unionKinQuery = `SELECT kinid, kinname, fightpower, server, leadername
FROM kin
WHERE kinid in (${KINID});`


const ACCOUNTID = '#ACCOUNTID#';
const unionAccountQuery = `SELECT accountid, server, roleid, rolename, fightpower, kinid, kinname, lastsavetime
FROM role
WHERE accountid in (${ACCOUNTID});`


router.get('/kin', (req, res) => {
    let ds = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const params = req.query;
    const kinIds = params['kinid'];
    const formatedKinIds = kinIds.split(',').map(kinId => '\'' + kinId.trim() + '\'').join(',');
    let query = unionKinQuery
        .replace(KINID, formatedKinIds);
    // console.log(query)
    pool.query(query, (err, results) => jsonResponse(res, err, results))
});

function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;

  }, {});
};

router.get('/account', (req, res) => {
    let ds = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const params = req.query;
    const accountIds = params['accountid'];
    const formatedAccountIds = accountIds.split(',').map(accountId => '\'' + accountId.trim() + '\'').join(',');
    let query = unionAccountQuery
        .replace(ACCOUNTID, formatedAccountIds);
    pool.query(query, (err, results) => {
      const accountData = groupBy(results.rows, 'accountid')
      const formatResults = {...results, rows: [accountData]}
      console.log(formatResults)
      jsonResponse(res, err, formatResults);
      }
    )
});

router.get('/info', (request, response) => {
  response.json({
    game: 'JX1M',
    department: 'GS1'
  })
})

module.exports = router
