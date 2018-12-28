// Load config from json in comon with the API server
import * as crossedEnv from '../../../config.json';
// Load config valid in all env
import { environment as genericEnv, IIthoughtsEnvironment }  from './environment.common';

export const environment: IIthoughtsEnvironment = Object.assign({}, crossedEnv, genericEnv, {
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