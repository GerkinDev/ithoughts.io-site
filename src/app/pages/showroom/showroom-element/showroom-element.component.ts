import { Input, Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { OwlChild } from 'ngx-owl-carousel/src/owl-child.component';
import { ShowroomPageComponent } from '../showroom-page.component';

const Diaspora = require( 'diaspora/dist/standalone/diaspora.min.js' );

@Component({
	selector: 'app-showroom-element',
	templateUrl: './showroom-element.component.html',
	styleUrls: ['./showroom-element.component.scss']
})
export class ShowroomElementComponent implements OnInit {
	@Input() name?: string;
	@Input() siteurl?: string;
	@Input() image?: string;
	@Input() descFr?: string;
	@Input() descEn?: string;
	@Input() tags?: string[];
	@Input() showroomPage?: ShowroomPageComponent;
	
	constructor(public translate: TranslateService) {}
	
	getDescription(lang: string = this.translate.currentLang) {
		if (!lang) {
			return '';
		}
		lang = lang.charAt(0).toUpperCase() + lang.substr(1);
		const descKey = 'desc' + lang;
		if (descKey in this) {
			return (this as any)[descKey] as string;
		}
		return '';
	}
	
	getShowroomElements(query: object = {}) {
	}

	ngOnInit() {
	}
}
