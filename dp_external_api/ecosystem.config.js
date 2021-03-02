let path = require('path');
let currentPath = path.dirname(__filename);
module.exports = {
	apps: [
		{
			name: 'dp_external_api',
			script: path.join(currentPath, 'bin', 'production'),
			//      watch       : true,
			env: {
				NODE_ENV: 'production',
				PORT: '5050',
			},
			instances: 8,
			exec_mode: 'cluster',
		},
	],
};
