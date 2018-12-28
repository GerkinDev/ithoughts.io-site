import { Input, Component, AfterContentInit, ElementRef, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {GoogleAnalyticsEventsService} from '../google-analytics-events.service';
import {MailService} from '../services/mail/mail.service';
import * as $ from 'jquery';

@Component( {
	selector: 'app-contact-form',
	templateUrl: './contact-form.html',
	styleUrls: ['./contact-form.scss'],
} )
export class ContactFormComponent implements AfterContentInit {
	@ViewChild( 'form', { read: ElementRef } ) public formEl?: ElementRef;
	@ViewChild( 'infos', { read: ElementRef } ) public infosEl?: ElementRef;
	@Input() public title = '';
	@Input() public defaultText = '';
	private captchaResponse?: string;


	public emailForm = new FormGroup( {
		name: new FormControl( '', Validators.required ),
		email: new FormControl( '', Validators.required ),
		type: new FormControl( '', Validators.required ),
		message: new FormControl( '', Validators.required ),
	} );

	public constructor(
		private mailService: MailService,
		private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private translateService: TranslateService
	) {
		if ( this.defaultText ) {
			this.emailForm.controls.message.setValue( this.defaultText );
		}
	}

	public resolved( captchaResponse: string ) {
		this.captchaResponse = captchaResponse;
	}

	public setStatus( statusString: string ) {
		if ( this.infosEl ) {
			this.infosEl.nativeElement.innerHTML = statusString;
		} else {
			console.log( statusString );
		}
	}

	public async submitContact() {
		if ( !this.captchaResponse ) {
			this.translateService.get( 'contactForm.result.captcha' ).subscribe( this.setStatus );
			return;
		}
		this.googleAnalyticsEventsService.emitEvent( 'testCategory', 'testAction', 'testLabel', 10 );
		if ( this.formEl ) {
			this.formEl.nativeElement.style.height = this.formEl.nativeElement.clientHeight + 'px';
			try {
				await this.mailService.sendMail( this.emailForm.value, this.captchaResponse );
				this.formEl.nativeElement.style.opacity = 0;
				this.formEl.nativeElement.style.height = 0;
				this.translateService.get( 'contactForm.result.success' ).subscribe( this.setStatus );
			} catch ( error ) {
				console.error( error );
				this.translateService.get( 'contactForm.result.error' ).subscribe( this.setStatus );
			}
		}
	}

	public ngAfterContentInit() {
	}
}
