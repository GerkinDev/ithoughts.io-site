import { Injectable } from '@angular/core';

const Diaspora = require( 'diaspora/dist/standalone/diaspora.min' );

import { environment } from '../../environments/environment';

@Injectable()
export class MailService {
	private ContactMail: any;

	constructor() {
		const apiUrl = (<any>environment).api.url as string;
		const apiSegments = apiUrl.match(/^(?:(https?):\/\/)?(.+?)(?::(\d+))?$/) as RegExpMatchArray;
		Diaspora.createNamedDataSource('main', 'webApi', {
			scheme: apiSegments[1],
			host:   apiSegments[2],
			port:   apiSegments[3],
		});
		this.ContactMail = Diaspora.declareModel('ContactMail', {
			sources: 'main',
			attributes: {
				recaptcha: {
					type: 'string',
					required: true,
				},
				senderMail: {
					type: 'string',
					required: true,
				},
				senderName: {
					type: 'string',
					required: true,
				},
				senderCategory: {
					type: 'string',
					required: true,
					enum: ['pro', 'part'],
				},
				message: {
					type: 'string',
					required: true,
				},
			},
		});
	}

	sendMail(mail: {
		email: string,
		name: string,
		type: string,
		message: string,
	}, recaptcha: string) {
		const remappedMail = {
			senderMail: mail.email,
			senderName: mail.name,
			senderCategory: mail.type,
			message: mail.message,
			recaptcha: recaptcha,
		};
		return this.ContactMail.spawn(remappedMail).persist();
	}
}
