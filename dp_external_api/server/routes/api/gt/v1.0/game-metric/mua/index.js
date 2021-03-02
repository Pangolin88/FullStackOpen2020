import {Router} from 'express';
import {Pool} from 'pg';
import {GAME_METRIC_CONNECTION_MUA, HTTP_ERROR_CODE} from "../../../../../../config";
import Utils from "../../../../../../extras/Utils";

const router = Router();

const query = {
    login: ' select ds,count(*) from ' +
        ' playerlogin where role_id=$1 and ds>=$2 and ds <=$3 group by ds',
    combatforce: 'select ds,combat_force from ' +
        ' (select max(log_date) as max_log_date from playerlogin where role_id=$1 and ds>=$2 and ds <= $3 group by ds ) a ' +
        ' left outer join (select combat_force,log_date,ds from playerlogin where role_id=$1 and ds>=$2 and ds <=$3) b on a.max_log_date=b.log_date ',
    combatforce_logout: 'select ds,combat_force from ' +
        ' (select max(log_date) as max_log_date from playerlogout where role_id=$1 and ds>=$2 and ds <= $3 group by ds ) a ' +
        ' left outer join (select combat_force,log_date,ds from playerlogout where role_id=$1 and ds>=$2 and ds <=$3) b on a.max_log_date=b.log_date ',
}

const pool = new Pool(GAME_METRIC_CONNECTION_MUA)
router.get('/', (req, res) => {
    const roleId = req.query.roleId
    const type = req.query.type
    let result = []
    let errorMessage = Utils.validateEmpty(['startedDate'], req.query)
    const startedDate = req.query.startedDate
    const endDate = req.query.endDate || startedDate

    if (errorMessage) return Utils.errorResponse(res, errorMessage, HTTP_ERROR_CODE.BAD_REQUEST);
    // Validate
    const start = new Date(startedDate)
    const end = new Date(endDate)
    const dateArr = Utils.getDateArray(start, end)

    if (!roleId)
	return Utils.errorResponse(res, 'roleId is required !', HTTP_ERROR_CODE.BAD_REQUEST)

    if (start.toString() === 'Invalid Date' || end.toString() === 'Invalid Date') {
        Utils.logToFile('Request invalid format date', 'error', 'gt')
        return Utils.errorResponse(res, 'Invalid Date Format', HTTP_ERROR_CODE.BAD_REQUEST)
    }

    if ((end - start) / 86400000 > 60) {
        Utils.logToFile('Request invalid date range', 'error', 'gt')
        return Utils.errorResponse(res, 'The date range is invalid. Please select within 60 days', HTTP_ERROR_CODE.BAD_REQUEST)
    }

    const queryTxt = query[type]
    if (!queryTxt) {
        return Utils.errorResponse(res, 'The type is invalid. Please choose "login" or "combatforce"', HTTP_ERROR_CODE.BAD_REQUEST)
    }

    const connection = {
        query: queryTxt,
        values: [roleId, startedDate, endDate]
    }

    pool.query(connection.query, connection.values, (err, results) => {
        if (!err) {
            if (type === 'combatforce') {
                pool.query(query.combatforce_logout, connection.values, (error, logoutCombat) => {
                    for (let i = 0; i < dateArr.length; i++) {
                        let combatLogin = results.rows.find(row => row.ds == dateArr[i]);
                        let combatLogout = logoutCombat.rows.find(row => row.ds == dateArr[i]);
                        if (!combatLogin) {
                            combatLogin = {}
                            combatLogin['combat_force'] = 0;
                        }
                        if (!combatLogout) {
                            combatLogout = {}
                            combatLogout['combat_force'] = 0;
                        }
                        let item = {
                            date: dateArr[i],
                            combatforce: Math.max(parseInt(combatLogin['combat_force']), parseInt(combatLogout['combat_force']))
                        }
                        result.push(item)
                    }
                    Utils.httpResponse(res, result)
                })
            } else {
                for (let i = 0; i < dateArr.length; i++) {
                    const found = results.rows.find(row => row.ds == dateArr[i]);
                    let item = {
                        date: dateArr[i],
                        isLogin: false,
                    }
                    if (found) {
                        item = {
                            date: dateArr[i],
                            isLogin: true,
                        }
                    }
                    result.push(item)
                }
                Utils.jsonResponse(res, result)
            }
            const logFile = Utils.dateToString(Utils.nowDate(), 'YYYY-MM-DD_HH');
            Utils.logToFile(`Querying from ${startedDate} to ${endDate}`, logFile, 'gt_mua_results')
            Utils.logToFile(queryTxt, logFile, 'gt_mua_results')
            Utils.logToFile('------------Result-------------' + JSON.stringify(result), logFile, 'gt_mua_results')
        } else {
            Utils.logToFile(JSON.stringify(err), 'error', 'gt')
            Utils.errorResponse(res, err)
        }
        pool.end()
    })

});

export default router;
