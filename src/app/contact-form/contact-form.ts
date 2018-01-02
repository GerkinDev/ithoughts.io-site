import { Input, Component } from '@angular/core';
import { AppTranslatableComponent } from '../app.translatableComponent';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {GoogleAnalyticsEventsService} from '../google-analytics-events.service';
import {MailService} from '../mail.service';

@Component({
	selector: 'app-contact-form',
	templateUrl: './contact-form.html',
	styleUrls: ['./contact-form.scss']
})
export class ContactFormComponent {
	@Input() title: String = undefined;
	@Input() defaultText: String;


	public emailForm = new FormGroup({
		name: new FormControl('', Validators.required),
		email: new FormControl('', Validators.required),
		type: new FormControl('', Validators.required),
		message: new FormControl('', Validators.required),
	});

	constructor(private mailService: MailService, private googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
		if (this.defaultText) {
			this.emailForm.controls.message.setValue(this.defaultText);
		}
	}

	submitContact(event) {
		console.log(event);
		this.googleAnalyticsEventsService.emitEvent('testCategory', 'testAction', 'testLabel', 10);
		this.mailService.sendMail(this.emailForm.value);
	}
}
