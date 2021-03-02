import readline from 'readline';
import fs from 'fs';
import { APPSFLYER_EVENTS_API } from '../../config';
import { Utils } from '../index';

export default class AppsflyerService {
	static pushRawAppEvent(eventName, appId, authentication, appsflyerId, event, event_time) {
		return new Promise((resolve) => {
			// console.log(extInfo);
			const data = {
				appsflyer_id: appsflyerId,
				eventName: eventName,
				eventValue: JSON.stringify({
					...event,
				}),
				eventTime: event_time,
				af_events_api: 'true',
			};
			const headers = {
				authentication: authentication,
				'Content-Type': 'application/json',
			};
			const callbackSuccess = (result) => {
				// Utils.logToFileForAnalyticAppEvent(JSON.stringify(event));
				resolve({
					status: 'success',
					message: 'Successfully',
					eventName,
				});
			};
			const callbackError = (error) => {
				Utils.logErrorToFileForAnalyticAppEvent(JSON.stringify(error.response));
				// Utils.logErrorToFileForAnalyticAppEvent(JSON.stringify(event));
				resolve({
					status: 'failed',
					message: JSON.stringify(error),
					eventName,
				});
			};
			Utils.makeHttpRequest(
				'post',
				APPSFLYER_EVENTS_API.URL.replace('<APP_ID>', appId),
				callbackSuccess,
				callbackError,
				data,
				headers,
				true
			);
		});
	}
}
