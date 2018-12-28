import { Injectable } from '@angular/core';

import { Diaspora, EFieldType } from '@diaspora/diaspora';

import { environment} from '../../../environments/environment';
import { IIthoughtsEnvironment } from '../../../environments/environment.common';

@Injectable()
export class MailService {
	private ContactMail: any;

	public constructor() {
		console.log( {environment} );
		const apiUrl = ( environment as IIthoughtsEnvironment ).api.url as string;
		const apiSegments = apiUrl.match( /^(?:(https?):\/\/)?(.+?)(?::(\d+))?$/ ) as RegExpMatchArray;
		const adapterConfig = {
			scheme: apiSegments[1],
			host:   apiSegments[2],
			port:   apiSegments[3] || ( environment as IIthoughtsEnvironment ).api.port,
			baseUrl: '',
		};
		console.log( adapterConfig );
		Diaspora.createNamedDataSource( 'main', 'webApi', adapterConfig );
		this.ContactMail = Diaspora.declareModel( 'ContactMailIthoughts', {
			sources: 'main',
			attributes: {
				recaptcha: {
					type: EFieldType.STRING,
					required: true,
				},
				senderMail: {
					type: EFieldType.STRING,
					required: true,
				},
				senderName: {
					type: EFieldType.STRING,
					required: true,
				},
				senderCategory: {
					type: EFieldType.STRING,
					required: true,
					enum: ['pro', 'part'],
				},
				message: {
					type: EFieldType.STRING,
					required: true,
				},
			},
		} );
	}

	public async sendMail( mail: {
		email: string;
		name: string;
		type: string;
		message: string;
	},                     recaptcha: string ) {
		const remappedMail = {
			senderMail: mail.email,
			senderName: mail.name,
			senderCategory: mail.type,
			message: mail.message,
			recaptcha: recaptcha,
		};
		const newEntity = this.ContactMail.spawn( remappedMail );
		console.log( {newEntity} );
		return newEntity.persist();
	}
}
