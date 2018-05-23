import { Injectable } from '@angular/core';

import { Diaspora } from '@diaspora/diaspora';

import { environment} from '../../environments/environment';
import { IIthoughtsEnvironment } from '../../environments/environment.common';

@Injectable()
export class MailService {
	private ContactMail: any;

	constructor() {
        console.log({environment})
		const apiUrl = (environment as IIthoughtsEnvironment).api.url as string;
		const apiSegments = apiUrl.match(/^(?:(https?):\/\/)?(.+?)(?::(\d+))?$/) as RegExpMatchArray;
		Diaspora.createNamedDataSource('main', 'webApi', {
			scheme: apiSegments[1],
			host:   apiSegments[2],
			port:   apiSegments[3] || (environment as IIthoughtsEnvironment).api.port,
		});
		this.ContactMail = Diaspora.declareModel('ContactMailIthoughts', {
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

	async sendMail(mail: {
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
        const newEntity = this.ContactMail.spawn(remappedMail);
        console.log({newEntity});
		return await newEntity.persist();
	}
}
