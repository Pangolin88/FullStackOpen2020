import { Router } from 'express';
import { Pool } from 'pg';
import {GAME_METRIC_CONNECTION, HTTP_ERROR_CODE} from '../../../../../config';
import {Utils} from "../../../../../extras";

const router = Router();

const pool = new Pool(GAME_METRIC_CONNECTION)
router.get('/', (req, res) => {
    let errorMessage = Utils.validateEmpty(['startedDate'], req.query)
    if (errorMessage) return Utils.errorResponse(res, errorMessage, HTTP_ERROR_CODE.BAD_REQUEST);
    const gameIds = !req.query.gameIds ? '' : req.query.gameIds.split(',').map(item => `'${item}'`);
    const startedDate = req.query.startedDate
    const endDate = req.query.endDate || startedDate

    // Validate
    const start = new Date(startedDate)
    const end = new Date(endDate)

    if (!!gameIds && req.query.gameIds.split(',').length > 20) {
        Utils.logToFile('Request more than 20 games', 'error', 'pass')
        Utils.errorResponse(res, 'Invalid GameIDs. Please select less than 20 games', HTTP_ERROR_CODE.BAD_REQUEST)
        return;
    }

    if (start.toString() === 'Invalid Date' || end.toString() === 'Invalid Date') {
        Utils.logToFile('Request invalid format date', 'error', 'pass')
        Utils.errorResponse(res, 'Invalid Date Format', HTTP_ERROR_CODE.BAD_REQUEST)
        return;
    }
    if ((end - start)/86400000 > 60) {
        Utils.logToFile('Request invalid date range', 'error', 'pass')
        Utils.errorResponse(res, 'The date range is invalid. Please select within 60 days', HTTP_ERROR_CODE.BAD_REQUEST)
        return;
    }


    const gameIdsQuery = !gameIds ? '' : `AND "GameID" IN (${gameIds.join(',')})`
    const query = {
        name: 'fetch-game-metric',
        text: 'SELECT * FROM game_metric ' +
            `WHERE "Date" >= $1 AND "Date" <= $2 ` +
            gameIdsQuery,
        values: [startedDate, endDate]
    }

    pool.query(query.text, query.values, (err, results) => {
        if (!err) {
            Utils.jsonResponse(res, results.rows)
            const logFile = [Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH-mm-ss'), Utils.generateShortUUID()].join('__')
            Utils.logToFile(`Querying from ${startedDate} to ${endDate}`, logFile, 'pass_results')
            Utils.logToFile(query.text, logFile, 'pass_results')
            Utils.logToFile('------------Result-------------\n' + JSON.stringify(results.rows), logFile, 'pass_results')
        } else {
            Utils.logToFile(JSON.stringify(err), 'error', 'pass')
            Utils.errorResponse(res, err)
        }
    })

});

export default router;