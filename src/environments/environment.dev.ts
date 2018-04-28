import * as env from '../../../config.json';

const environment: any = Object.assign(env, {
	production: false,
	app: {
		port: 4200,
		url: 'https://ithoughts.io',
		recaptchaKey: '6LcLfUEUAAAAAF3OZ-lZsMIdc66VS6xtcHphUlhk',
	},
	api: {
		port: 3210,
		url: 'http://localhost'
	}
});

export {environment};
