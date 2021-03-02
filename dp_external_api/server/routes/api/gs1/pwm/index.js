import {Router} from 'express';
import HttpUtil from "../../../../extras/HttpUtils";
import moment from 'moment';
import {Pool} from "pg";
import {PWM_CONNECTION} from "../../../../config";
import Utils from "../../../../extras/Utils";

const router = Router();

const TU_VI = '#TU_VI#';
const CONDITION = '#CONDITION#';
const DS = '#DS#';
const pool = new Pool(PWM_CONNECTION);

let tu_vi = 'tu_vi_ca_nhan';
let condition = " ";
const queryTemplate = `
SELECT DISTINCT b.roleid,b.rolename,b.${TU_VI},s.server_id,s.server_name,o.occupation_id,o.occupation_name FROM bxh b
LEFT JOIN servers s ON s.server_id = b.may_chu
LEFT JOIN occupation o ON o.occupation_id = b.he_phai
WHERE ds = '${DS}' ${CONDITION}
ORDER BY b.${TU_VI} DESC
LIMIT 100;`;

function jsonResponse(res, err, results) {
    if (!err) {
        Utils.jsonResponse(res, results.rows);
        const logFile = Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH');
        Utils.logToFile(
            ' --Result-- ' + JSON.stringify(results.rows),
            logFile,
            'gs1_pwm_results'
        );
    } else {
        Utils.logToFile(JSON.stringify(err), 'error', 'gs1');
        Utils.errorResponse(res, err);
    }
}

router.get('/info', (req, res) => {
    HttpUtil.makeJsonResponse(res, {
        game: 'PWM',
        department: 'GS1'
    })
});

router.get('/ranking', (req, res) => {
    let ds = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const params = req.query;
    const server = params['server'];
    const occupation = params['occupation'];
    let where = condition;
    if (server) where += `AND (CAST(s.server_id AS TEXT) = '${server}' OR s.server_name = '${server}') `;
    if (occupation) where += `AND (CAST(o.occupation_id AS TEXT) = '${occupation}' OR o.occupation_name = '${occupation}') `;
    let query = queryTemplate
        .replace(TU_VI, params['tu_vi'] || tu_vi)
        .replace(TU_VI, params['tu_vi'] || tu_vi)
        .replace(DS, params['date'] || ds)
        .replace(CONDITION, where);
    pool.query(query, (err, results) => jsonResponse(res, err, results))
});

router.get('/servers', (req, res) => {
    const query = 'SELECT server_id, server_name FROM servers WHERE is_active = true ';
    pool.query(query, (err, results) => jsonResponse(res, err, results))
});

router.get('/occupations', (req, res) => {
    const status = req.params[status] || true;
    const query = 'SELECT occupation_id, occupation_name FROM occupation WHERE is_active = true ';
    pool.query(query, (err, results) => jsonResponse(res, err, results))
});


export default router;