import {Injectable} from '@angular/core';

@Injectable()
export class GoogleAnalyticsEventsService {
	public emitEvent(eventCategory: string, eventAction: string, eventLabel?: string, eventValue?: number): void {
		ga('send', 'event', {
			eventCategory: eventCategory,
			eventLabel: eventLabel,
			eventAction: eventAction,
			eventValue: eventValue
		});
	}
}
