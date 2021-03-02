import {Router} from 'express';
import HttpUtil from "../../../../extras/HttpUtils";
import {Pool} from "pg";
import {JX_PROMOTION_CONNECTION} from "../../../../config";
import Utils from "../../../../extras/Utils";

const router = Router();
const pool = new Pool(JX_PROMOTION_CONNECTION);

function jsonResponse(res, err, results, account) {
    if (!err) {
        if (results.rows.length === 0)
            Utils.jsonResponse(res, {account, sum: "0"})
        else Utils.jsonResponse(res, results.rows[0]);
        const logFile = Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH');
        Utils.logToFile(
            ' --Result-- ' + JSON.stringify(results.rows[0]),
            logFile,
            'gs1_jx_results'
        );
    } else {
        Utils.logToFile(JSON.stringify(err), 'error', 'gs1');
        Utils.errorResponse(res, err);
    }
}

router.get('/book-level', (req, res) => {
    const account = req.query['account'];
    const game = req.query['game'];
    const server = req.query['server'] || '';
    if (!game) HttpUtil.makeErrorResponse(res, {message: 'Invalid Game'}, 400);
    if (!account) HttpUtil.makeErrorResponse(res, {message: 'Invalid account'}, 400);
    let query = `
        SELECT * FROM ${game}_book_level 
        WHERE LOWER(account)='${account.toLowerCase()}' ${server ? ` AND server = '${server}'` : ' '}
        ORDER BY level DESC
        LIMIT 1;
    `;
    pool.query(query, (err, results) => jsonResponse(res, err, results))
});

router.get('/wjx_vote', (req, res) => {
    const account = req.query['account'];
    if (!account) HttpUtil.makeErrorResponse(res, {message: 'Invalid account'}, 400);
    let query = `
        SELECT account, sum(vote_number) FROM wjx_vote 
        WHERE LOWER(account)='${account.toLowerCase()}' 
        GROUP BY account
        LIMIT 1;
    `;
    pool.query(query, (err, results) => jsonResponse(res, err, results, account))
});

export default router;