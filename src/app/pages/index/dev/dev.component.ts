import { Component } from '@angular/core';
import {GoogleAnalyticsEventsService} from '../../../google-analytics-events.service';

@Component({
  selector: 'app-web-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss']
})
export class DevComponent {
	constructor(public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
	}

	clickedSeeMore(category: string) {
		this.googleAnalyticsEventsService.emitEvent('CTA', 'click', `See more about ${category}`, 10);
	}
}
