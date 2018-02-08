import { Component } from '@angular/core';
import { AppTranslatableComponent } from './app.translatableComponent';

import {Router, NavigationEnd} from '@angular/router';
import {GoogleAnalyticsEventsService} from './google-analytics-events.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent extends AppTranslatableComponent {
	title = 'iThoughts';
	today = new Date();

	constructor(public router: Router, public googleAnalyticsEventsService: GoogleAnalyticsEventsService, translate: TranslateService) {
		super(translate);
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				ga('set', 'page', event.urlAfterRedirects);
				ga('send', 'pageview');
			}
		});
	}
}
