export const FB_DESTINATION_TYPE = ['fb_audience_list', 'fb_analytic'];
export const MASKED_IDENTITY_TYPE = ['device_id', 'mail', 'phone'];
export const UNMASKED_DATA_PREVIEW_COUNT = 10;
export const FACEBOOK_UPDATE_CUSTOM_AUDIENCE_PER_TIME = 10000;
export const JWT_SECRECT = '.fgt"v`k?WPxR,y^q}E72%qaj;f~Ikc-Wi[0XfQ7';

export const HTTP_ERROR_CODE = {
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
	SERVER_ERROR: 500,
};

export const STATUS_JOB_LIST = {
	INIT: 'init',
	PROCESSING: 'processing',
	SUBMITTED: 'submitted',
};

export const ACTION_TYPE = {
	CREATE: 'create',
	UPDATE: 'update',
};

export const FACEBOOK_API = {
	CREATE_CUSTOM_AUDIENCE: 'https://graph.facebook.com/v3.2/act_:AD_ACCOUNT_ID/customaudiences',
	UPDATE_CUSTOM_AUDIENCE: 'https://graph.facebook.com/v3.2/:CUSTOM_AUDIENCE_ID/users',
	PUSH_APP_EVENT: 'https://graph.facebook.com/v3.2/:APP_ID/activities',
};

export const FACEBOOK_API_V1_1 = {
	CREATE_CUSTOM_AUDIENCE: 'https://graph.facebook.com/v3.3/act_:AD_ACCOUNT_ID/customaudiences',
	UPDATE_CUSTOM_AUDIENCE: 'https://graph.facebook.com/v3.3/:CUSTOM_AUDIENCE_ID/users',
	PUSH_APP_EVENT: 'https://graph.facebook.com/v3.3/:APP_ID/activities',
};

export const FACEBOOK_API_V1_2 = {
	CREATE_CUSTOM_AUDIENCE: 'https://graph.facebook.com/v7.0/act_:AD_ACCOUNT_ID/customaudiences',
	UPDATE_CUSTOM_AUDIENCE: 'https://graph.facebook.com/v7.0/:CUSTOM_AUDIENCE_ID/users',
	PUSH_APP_EVENT: 'https://graph.facebook.com/v7.0/:APP_ID/activities',
};

export const FB_AUDIENCE_HASH_TYPE_MAPPING = {
	mail: 'EMAIL_SHA256',
	phone: 'PHONE_SHA256',
	device_id: 'MOBILE_ADVERTISER_ID',
};

export const FACEBOOK_BUSINESS_ACCESS_TOKEN = {
	GS2:
		'EAAB9fv72raQBANfiMPqKY72XLoNcu2kQZCK99ycX7t72Idqk0WWIk7ZCiM2MZCGbeJxkd4jTv2gkDqZCZC9liuCCDKuZBRalncxBIDhpx0AVI31so8RieiV1qChqZCFtZBaaQKVT6ExZCnGeMQv2NxK9bZC8bZAZCdlAvqcyH81zN7HZBESlTJqYNhTbC',
	GS2_OVERSEA:
		'EAAPyDCbezZBABABGnBkXBtBRVhS30dNZCGEhcJYJ1hmaCDMSLplc2gJDJR7tNF8j6EACeQRzsjcZBgKOSjlPOCMc1aI535JOveYAWlI8Q3bvhZCVrBBlV3dZBIihiOUKWKyjxyxPm4EeZCi4sZCHtxAA4HIRZBFhVdiVId0OGdzeKB1RaI3tRX9YGpIiF5tj5mgyPkJG9e8EcgZDZD',
	PG3:
		'EAADGhp2eElgBAOw1Nbb3cCbXQt9gqF2He4VANzJNCBKBpVMZBDCAgpUUCjjXyIDW5ccNTqBRkGL2D59zEzGm4pA2DRjsZAR9tIPuXeaO6NWRnznh3mQEQHtWfGw2KTZAYaDCr3NZC1HpZCb0RIIYQRWGyrb33jt6mL8ptIf1H9voZAeZC6wNExnA3tG7YpnYyoZD',
	PG1:
		'EAAEEh6bZB62ABADq6XSQV79QeINTrb1D89TiynLmxz3Kz9UGFrQcOCMDnfaFV7ztfNQ9eyq5WagX9XYfTKJtNB8E6LK7fmZANgZAe1vDx11S9FZBD5BHWPvrv7CxKmZCXyic83BRVe6oPe7GLAZAzC0hxtp6aMq2HMQhzcVPmWoCxwnYQ0yBmC',
	PG2:
		'EAAGqhS6oeCQBADFAgZBA1lsYrveEch5MXQW4xZBKTWKXquAJ8gzqrQIoROH2r7K8QS91QEp2z6iNZC15YULhOGhedYGWikL8jWqi7dpBUOIfMWfD4UuJW7OQzqoTvfypbIioKZBUodlQ6SxhJpiALdD09NP9mUPOvMVOO1oZA2jjfEcXvZBcEY',
	PP:
		'EAAOfn5THSHABAHHAMNvpeGX3e3D9LwpU8pMOyRljfH7md6ZAC3WSByW78MLuK1MNZCtYrVUB3YBhg2ZCnupzoRWWqiDVJ88ZAsGjZCQtzpi2RW9Rd3BzWhMPD6M2THZCRN5BUgs6hZByHNrXbtXaosM1iLEFgj4SR40lXLnZCOQZBfVxRhrnCt7zU1FO1AzbpKsAZD',
	GS5:
		'EAAFim6zMFoABALAhnnuL5U4URURlfHokxhySZBYPh4sX2pkrUU1yEG6cLH0FEZBl73qgyHZCvUeMt2KxAVOmyQTAWL0KLN73fokAzUq4ZCOMJORYezZBYVlvEgKzQdGJOBGK9Ai2pag91Rc6Q8Q6kJlqZBQ1uAsUk9hKfXr0etqIZBcytKJJ3LmIwyiR0pdzxlriZBcdcp2LpQZDZD',
};

export const FACEBOOK_BUSINESS_ACCESS_TOKEN_V3_3 = {
	GS2_OVERSEA:
		'EAAPyDCbezZBABAJmmfULWH0VzTuwxFEQO5982QtKZAQncXAbWsJXcOXu2Hu8VtUQbI1ZAzZCzJy63mZBM3BBocvYTsRXZAt2o7KSe6BgKkNU0sM8gZBS6VBeyPzWsvDMw7k4yhmxRH6MYWrWtLEm3i38W4v52ESqpWXZBqZCiZAPmlGuluJCa2lyz0Uh2rfDxTKBzagbT656NTOQZDZD',
	PG2:
		'EAAGqhS6oeCQBAHAlW2qX95XsLSmMB4mYBltvQFklWgThnciDsKJmdI5mOKGhJL5D5jsVWxY2LMDus10xJPIqUvyJmPZAatws3octzAbghZC12o17xPoZBUlemnSy2WE3ANVqVZA9UFVK4qB7ZCfZAtxvkVLHOAIioyD0QQfCLLdVIbRV424p97E2v537Ij9BmUo6G9CO4nIgZDZD',
	PP:
		'EAAOfn5THSHABABH5wwDIlVIhSolgQTlts5Wa6ZCnVdJsW49jTwlgJ6vX5a1PLwH39hHowdDW7WbRpWkvJ6kzH5hen1V9sdK2Jm92vabZBzNgVex8k3shZCZBe4Jw0f3ZBqYDvN8KfLoKKc8d51DJryrxwXLZAlUg49tvvIeMAQijtgcV2C2XNLpRv9cEmZCbbVEFNavB4HZBJgZDZD',
	PG1:
		'EAAEEh6bZB62ABACmdjbfIEMuO39F8DlSCWRoOzcEkmxnqz7WnZB3IpFHE7kZCn3TbFrQPZBA9ZBSwnzR27ldu69ZARrA3nHNwE1qd4WrZBVpNUgkiByTvtljrJo6e9cHo1Xr67sYrG08icoLUwFD5Fu0DtkekNWVb1F0IjZAcaROF2xkQd9XoqdZBXzz3I1Tt7DwZD',
	GS2:
		'EAAMrU8I8SykBABIxIisrJ7gQFWFZBdtnuRplgpvRR4OoqOKH3S8EuobiXVJX05rbJSuSEOZCLB6pd9kL6IQVkZANxDJYWXxuU8jcIeCZASG7lFqzK0k0pMjZAVWCWNUBYqdSphpS475Ro8Kky5sJoZBWjgZC4S5DgOluAj0JFoNZC9D0lY8bgJIpmwZBSYkBDdfoZD',
	GS5:
		'EAAFim6zMFoABALAhnnuL5U4URURlfHokxhySZBYPh4sX2pkrUU1yEG6cLH0FEZBl73qgyHZCvUeMt2KxAVOmyQTAWL0KLN73fokAzUq4ZCOMJORYezZBYVlvEgKzQdGJOBGK9Ai2pag91Rc6Q8Q6kJlqZBQ1uAsUk9hKfXr0etqIZBcytKJJ3LmIwyiR0pdzxlriZBcdcp2LpQZDZD',
	//Verion 3.2
	PG3:
		'EAADGhp2eElgBAOw1Nbb3cCbXQt9gqF2He4VANzJNCBKBpVMZBDCAgpUUCjjXyIDW5ccNTqBRkGL2D59zEzGm4pA2DRjsZAR9tIPuXeaO6NWRnznh3mQEQHtWfGw2KTZAYaDCr3NZC1HpZCb0RIIYQRWGyrb33jt6mL8ptIf1H9voZAeZC6wNExnA3tG7YpnYyoZD',
};

export const FACEBOOK_BUSINESS_ACCESS_TOKEN_V4_0 = {
	//Version 3.3
	GS2_OVERSEA:
		'EAAPyDCbezZBABAJmmfULWH0VzTuwxFEQO5982QtKZAQncXAbWsJXcOXu2Hu8VtUQbI1ZAzZCzJy63mZBM3BBocvYTsRXZAt2o7KSe6BgKkNU0sM8gZBS6VBeyPzWsvDMw7k4yhmxRH6MYWrWtLEm3i38W4v52ESqpWXZBqZCiZAPmlGuluJCa2lyz0Uh2rfDxTKBzagbT656NTOQZDZD',
	PG2:
		'EAAGqhS6oeCQBAHAlW2qX95XsLSmMB4mYBltvQFklWgThnciDsKJmdI5mOKGhJL5D5jsVWxY2LMDus10xJPIqUvyJmPZAatws3octzAbghZC12o17xPoZBUlemnSy2WE3ANVqVZA9UFVK4qB7ZCfZAtxvkVLHOAIioyD0QQfCLLdVIbRV424p97E2v537Ij9BmUo6G9CO4nIgZDZD',
	PP:
		'EAADbkfJrQZCABAI6dYWZBZCZCQpKlJ0IvDDeDaeHx9fYzwQW4Vv5FUU9ZCvR9O289QhHLyIosOLjcapkntWm9B3R43eOJnYBDJlGhQgow3loocxxJcnzaO1UFHZBjyMXucQPoLmVZC41ZA5cM5KO70izfVZAU1EmZAjSAjZBwT1YWneSAqiNBFP9r82',
	GS9:
		'EAADbkfJrQZCABAI6dYWZBZCZCQpKlJ0IvDDeDaeHx9fYzwQW4Vv5FUU9ZCvR9O289QhHLyIosOLjcapkntWm9B3R43eOJnYBDJlGhQgow3loocxxJcnzaO1UFHZBjyMXucQPoLmVZC41ZA5cM5KO70izfVZAU1EmZAjSAjZBwT1YWneSAqiNBFP9r82',
	PG1:
		'EAAEEh6bZB62ABACmdjbfIEMuO39F8DlSCWRoOzcEkmxnqz7WnZB3IpFHE7kZCn3TbFrQPZBA9ZBSwnzR27ldu69ZARrA3nHNwE1qd4WrZBVpNUgkiByTvtljrJo6e9cHo1Xr67sYrG08icoLUwFD5Fu0DtkekNWVb1F0IjZAcaROF2xkQd9XoqdZBXzz3I1Tt7DwZD',
	GS2:
		'EAADbkfJrQZCABAI6dYWZBZCZCQpKlJ0IvDDeDaeHx9fYzwQW4Vv5FUU9ZCvR9O289QhHLyIosOLjcapkntWm9B3R43eOJnYBDJlGhQgow3loocxxJcnzaO1UFHZBjyMXucQPoLmVZC41ZA5cM5KO70izfVZAU1EmZAjSAjZBwT1YWneSAqiNBFP9r82',
	PG3:
		'EAADGhp2eElgBAOw1Nbb3cCbXQt9gqF2He4VANzJNCBKBpVMZBDCAgpUUCjjXyIDW5ccNTqBRkGL2D59zEzGm4pA2DRjsZAR9tIPuXeaO6NWRnznh3mQEQHtWfGw2KTZAYaDCr3NZC1HpZCb0RIIYQRWGyrb33jt6mL8ptIf1H9voZAeZC6wNExnA3tG7YpnYyoZD',
	// Version 4.0
	GS5:
		'EAADbkfJrQZCABAI6dYWZBZCZCQpKlJ0IvDDeDaeHx9fYzwQW4Vv5FUU9ZCvR9O289QhHLyIosOLjcapkntWm9B3R43eOJnYBDJlGhQgow3loocxxJcnzaO1UFHZBjyMXucQPoLmVZC41ZA5cM5KO70izfVZAU1EmZAjSAjZBwT1YWneSAqiNBFP9r82',
	GS5_ALSEA:
		'EAADbkfJrQZCABAI6dYWZBZCZCQpKlJ0IvDDeDaeHx9fYzwQW4Vv5FUU9ZCvR9O289QhHLyIosOLjcapkntWm9B3R43eOJnYBDJlGhQgow3loocxxJcnzaO1UFHZBjyMXucQPoLmVZC41ZA5cM5KO70izfVZAU1EmZAjSAjZBwT1YWneSAqiNBFP9r82',
	DP:
		'EAADbkfJrQZCABAI6dYWZBZCZCQpKlJ0IvDDeDaeHx9fYzwQW4Vv5FUU9ZCvR9O289QhHLyIosOLjcapkntWm9B3R43eOJnYBDJlGhQgow3loocxxJcnzaO1UFHZBjyMXucQPoLmVZC41ZA5cM5KO70izfVZAU1EmZAjSAjZBwT1YWneSAqiNBFP9r82'
};

export const FACEBOOK_APP_ID_LIST = {
	PG3: {
		TSQ: '157235294834908',
		THIENNU: '1845195695765124',
		CA3D: '117695218946519',
		DTM: '186845851812499',
		DDVS: '186845851812499',
	},
	GS2: {
		MUA: '914568778730136',
		GUNGA: '556524031204946',
		MUM: '1523186934473623',
	},
};

export const TABLEAU_SERVER_API = 'https://atlas.vng.com.vn/api/3.1';
export const CREDENTIAL_TABLEAU = {
	credentials: {
		name: 'tbadmin',
		password: '6R6BuFjdUs4hl9Fk3RNM',
		site: {
			contentUrl: '',
		},
	},
};

export const APPSFLYER_EVENTS_API = {
	URL: 'https://api2.appsflyer.com/inappevent/<APP_ID>',
};

export const USD_EXCHANGE_RATE = 23200;
