import { Input, Component, AfterContentInit, ElementRef, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {GoogleAnalyticsEventsService} from '../google-analytics-events.service';
import {MailService} from '../services/mail.service';
import * as $ from 'jquery';

@Component({
	selector: 'app-contact-form',
	templateUrl: './contact-form.html',
	styleUrls: ['./contact-form.scss']
})
export class ContactFormComponent implements AfterContentInit {
	@ViewChild('form', { read: ElementRef }) formEl: ElementRef;
	@ViewChild('infos', { read: ElementRef }) infosEl: ElementRef;
	@Input() title: String = undefined;
	@Input() defaultText: String;
	public name;
	public email;
	public type;
	public message;
	private captchaResponse: string;


	public emailForm = new FormGroup({
		name: new FormControl('', Validators.required),
		email: new FormControl('', Validators.required),
		type: new FormControl('', Validators.required),
		message: new FormControl('', Validators.required),
	});

	constructor(
	private mailService: MailService,
	 private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
	 private translateService: TranslateService
	) {
		if (this.defaultText) {
			this.emailForm.controls.message.setValue(this.defaultText);
		}
	}

	resolved(captchaResponse: string) {
		this.captchaResponse = captchaResponse;
	}

	submitContact(event) {
		if (!this.captchaResponse) {
			this.translateService.get('contactForm.result.captcha').subscribe(translated => {
				this.infosEl.nativeElement.innerHTML = translated;
			});
			return;
		}
		this.googleAnalyticsEventsService.emitEvent('testCategory', 'testAction', 'testLabel', 10);
		this.formEl.nativeElement.style.height = this.formEl.nativeElement.clientHeight + 'px';
		this.mailService.sendMail(this.emailForm.value, this.captchaResponse).then(() => {
			this.formEl.nativeElement.style.opacity = 0;
			this.formEl.nativeElement.style.height = 0;
			this.translateService.get('contactForm.result.success').subscribe(translated => {
				this.infosEl.nativeElement.innerHTML = translated;
			});
		}).catch(error => {
			console.error(error);
			this.translateService.get('contactForm.result.error').subscribe(translated => {
				this.infosEl.nativeElement.innerHTML = translated;
			});
		});
	}

	ngAfterContentInit() {
	}
}
