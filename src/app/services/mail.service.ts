import { Injectable } from '@angular/core';

import * as Diaspora from 'diaspora/dist/standalone/diaspora.min.js';

import { environment } from '../../environments/environment';

@Injectable()
export class MailService {
	private ContactMail;

	constructor() {
		const apiUrl = (<any>environment).api.url;
		const apiSegments = apiUrl.match(/^(?:(https?):\/\/)?(.+?)(?::(\d+))?$/);
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

	sendMail(mail, recaptcha) {
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
