import { Input, Component } from '@angular/core';

@Component({
	selector: 'app-plain-page-head',
	templateUrl: './plain-page-head.html',
	styleUrls: ['./plain-page-head.scss']
})
export class PlainPageHeadComponent {
	@Input() title?: string;
	@Input() subtitle?: string;
	private homeScene: any;

	scrollOutPage() {
		const dom = document.querySelector('app-plain-page-head + *') as HTMLElement;
		const rect = dom.getBoundingClientRect();
		window.scrollTo({ left: window.pageXOffset, top: rect.top + window.pageYOffset - 50, behavior: 'smooth' });
	}

	homeSceneReady(...args: any[]) {
			console.log('HomeScene ready', args);
		// this.homeScene = scene;
	}
}
