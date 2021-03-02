import {Router} from 'express';
import {TABLEAU_SERVER_API, CREDENTIAL_TABLEAU } from "../../../../../config";
import HttpUtil from "../../../../../extras/HttpUtils";
import Utils from "../../../../../extras/Utils";
import _ from 'lodash';

const router = Router();
let ACCESS_SITES = [
    "CentralBI",
    "DAL",
    "DAL-Demo",
    "GS1",
    "GS2",
    "GS5",
    "PG2",
    "PG3",
    "PP",
    "GS6",
    "ZaloPay"
];

router.get('/info',  (req, res) => {
    HttpUtil.getJson(`${TABLEAU_SERVER_API}/serverinfo`)
        .then(info => HttpUtil.makeJsonResponse(res, info))
        .catch(error => {
            Utils.logErrorToFileForTableau(JSON.stringify(error))
            HttpUtil.makeErrorResponse(res, error, 500)
        })
});

router.get('/sites/:siteId/workbooks', (req, res) => {
    const siteId = req.params['siteId']
    if (!_.includes(ACCESS_SITES, siteId)) return HttpUtil.makeErrorResponse(res, {message: 'Unauthorized'}, 401);
    let credentials = {
        ...CREDENTIAL_TABLEAU,
    }
    credentials.credentials.site.contentUrl = req.params['siteId']
    HttpUtil.postJson(`${TABLEAU_SERVER_API}/auth/signin`, credentials)
        .then(response => {
            const token = response.credentials.token;
            const headers = {'X-Tableau-Auth': token};
            HttpUtil.getJson(`${TABLEAU_SERVER_API}/sites/${response.credentials.site.id}/workbooks`, null, headers)
                .then(response => {
                    let workbooks = response.workbooks.workbook;
                    workbooks = workbooks.map(workbook => ({
                        id: workbook.id,
                        name: workbook.name,
                        workbookId: workbook.contentUrl,
                    }))
                    HttpUtil.makeJsonResponse(res, workbooks)
                })
                .catch(err => {
                    Utils.logErrorToFileForTableau('Failed to get workbook')
                    HttpUtil.makeErrorResponse(res, {...err.response.data.error, status: 'failed'}, 500)
                })
        }).catch(err => Utils.logErrorToFileForTableau("Authentication Failed"))
})

router.get('/sites/:siteId/tasks/:taskId/runNow', (req, res) => {
    const siteId = req.params['siteId']
    if (!_.includes(ACCESS_SITES, siteId)) return HttpUtil.makeErrorResponse(res, {message: 'Unauthorized'}, 401);
    let credentials = {
        ...CREDENTIAL_TABLEAU,
    }
    credentials.credentials.site.contentUrl = req.params['siteId']
    HttpUtil.postJson(`${TABLEAU_SERVER_API}/auth/signin`, credentials)
        .then(response => {
            const token = response.credentials.token;
            const headers = {'X-Tableau-Auth': token};
            HttpUtil.postJson(`${TABLEAU_SERVER_API}/sites/${response.credentials.site.id}/tasks/extractRefreshes/${req.params['taskId']}/runNow`, {}, headers)
                .then(response => {
                    const dataToDal = {
                        workbook: response.job.extractRefreshJob.workbook,
                        mode: response.job.mode,
                        type: response.job.type,
                    }
                    HttpUtil.makeJsonResponse(res, dataToDal)
                })
                .catch(err => {
                    Utils.logErrorToFileForTableau(JSON.stringify(err.response.data))
                    HttpUtil.makeErrorResponse(res, {...err.response.data, status: 'failed'}, 500)
                })
        }).catch(err => Utils.logErrorToFileForTableau("Authentication Failed"))
})

router.get('/sites/:siteId/tasks', (req, res) => {
    const siteId = req.params['siteId']
    if (!_.includes(ACCESS_SITES, siteId)) return HttpUtil.makeErrorResponse(res, {message: 'Unauthorized'}, 401);
        let credentials = {
            ...CREDENTIAL_TABLEAU,
        }
        credentials.credentials.site.contentUrl = req.params['siteId']
        HttpUtil.postJson(`${TABLEAU_SERVER_API}/auth/signin`, credentials)
            .then(response => {
                const token = response.credentials.token;
                const headers = {'X-Tableau-Auth': token};
                HttpUtil.getJson(`${TABLEAU_SERVER_API}/sites/${response.credentials.site.id}/tasks/extractRefreshes`, null, headers)
                    .then(taskResponse => {
                        let tasks = taskResponse.tasks.task;
                        Promise.all(tasks.map(async task => {
                            const schedule = {
                                name: task.extractRefresh.schedule.name,
                                state: task.extractRefresh.schedule.state,
                                type: task.extractRefresh.schedule.type,
                                nextRunAt: task.extractRefresh.schedule.nextRunAt
                            };

                            let workbook = {};
                            let project = {};
                            let connections = [];

                            if (task.extractRefresh.workbook && task.extractRefresh.workbook.id) {
                                const workbookResponse = await HttpUtil.getJson(`${TABLEAU_SERVER_API}/sites/${response.credentials.site.id}/workbooks/${task.extractRefresh.workbook.id}`, null, headers)
                                workbook = {
                                    id: workbookResponse.workbook.id,
                                    name: workbookResponse.workbook.name,
                                    workbookId: workbookResponse.workbook.contentUrl
                                };
                                const datasourceConnectionResponse = await HttpUtil.getJson(`${TABLEAU_SERVER_API}/sites/${response.credentials.site.id}/workbooks/${workbook.id}/connections`, null, headers)
                                project = workbookResponse.workbook.project
                                connections = datasourceConnectionResponse.connections.connection;
                            }

                            if (task.extractRefresh.datasource) {
                                const datasourceConnectionResponse = await HttpUtil.getJson(
                                    `${TABLEAU_SERVER_API}/sites/${response.credentials.site.id}/datasources/${task.extractRefresh.datasource.id}/connections`, null, headers)
                                connections = datasourceConnectionResponse.connections.connection;
                            }
                            return {id: task.extractRefresh.id, name: task.extractRefresh.name, schedule, workbook, project, connections}
                        })).then(results => {
                            HttpUtil.makeJsonResponse(res, results)
                        }).catch(err => {
                            const error = err.response ? err.response.data.error : err;
                            Utils.logErrorToFileForTableau(JSON.stringify(error))
                        })
                    }).catch(err => {
                    Utils.logErrorToFileForTableau('Failed to get task ' + JSON.stringify(err.response.data.error))
                    HttpUtil.makeErrorResponse(res, {...err.response.data.error, status: 'failed'}, 500)
                })
            }).catch(err => {
                Utils.logErrorToFileForTableau("Authentication Failed")
            })
})

router.get('/sites/:siteId', (req, res) => {
    const siteId = req.params['siteId']
    if (!_.includes(ACCESS_SITES, siteId)) return HttpUtil.makeErrorResponse(res, {message: 'Unauthorized'}, 401);
    HttpUtil.postJson(`${TABLEAU_SERVER_API}/auth/signin`, CREDENTIAL_TABLEAU)
        .then(response => {
            const token = response.credentials.token;
            const headers = {'X-Tableau-Auth': token};
            HttpUtil.getJson(`${TABLEAU_SERVER_API}/sites`, null, headers)
                .then(response => {
                    const sites = response.sites.site;
                    const site = sites.find(site => ACCESS_SITES.indexOf(site.contentUrl) >= 0 && site.contentUrl === req.params['siteId']);
                    const dtoSite = {
                        id: site.id,
                        name: site.name,
                        siteId: site.contentUrl,
                        state: site.state,
                    }
                    HttpUtil.makeJsonResponse(res, dtoSite)
                })
                .catch(err => {
                    Utils.logErrorToFileForTableau("Failed to get sites")
                    HttpUtil.makeErrorResponse(res, {message: 'Failed to get sites', status: 'failed'}, 500)
                })
        })
})

router.get('/sites', (req, res) => {
    HttpUtil.postJson(`${TABLEAU_SERVER_API}/auth/signin`, CREDENTIAL_TABLEAU)
        .then(response => {
            const token = response.credentials.token;
            const headers = {'X-Tableau-Auth': token};
            HttpUtil.getJson(`${TABLEAU_SERVER_API}/sites`, null, headers)
                .then(response => {
                    let sites = response.sites.site || [];
                    sites = sites.filter(site => ACCESS_SITES.indexOf(site.contentUrl) >= 0 )
                        .map(site => ({
                            id: site.id,
                            name: site.name,
                            siteId: site.contentUrl,
                            state: site.state,
                        }))
                    HttpUtil.makeJsonResponse(res, sites)
                })
                .catch(err => {
                    Utils.logErrorToFileForTableau("Failed to get sites")
                    HttpUtil.makeErrorResponse(res, {...err.response.data.error, status: 'failed'}, 500)
                })
        }).catch(err => {
        Utils.logErrorToFileForTableau("Authentication Failed")
    })

})

export default router;