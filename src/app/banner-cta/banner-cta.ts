import { Input, Component } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form';

import {TranslateService} from '@ngx-translate/core';
import {GoogleAnalyticsEventsService} from '../google-analytics-events.service';

@Component({
	selector: 'app-banner-cta',
	templateUrl: './banner-cta.html',
	styleUrls: ['./banner-cta.scss'],
})
export class BannerCtaComponent {
	public formHidden = true;
	@Input() public title = '';
	@Input() public catchPhrase = '';
	@Input() public cta = '';

	constructor(public googleAnalyticsEventsService: GoogleAnalyticsEventsService) { }

	toggleForm() {
		this.formHidden = !this.formHidden;
		if (this.formHidden === false) {
			this.googleAnalyticsEventsService.emitEvent('CTA', 'contact', 'Opened contact form', 1);
		}
	}
}
