import { Input, Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import * as Diaspora from 'diaspora/dist/standalone/diaspora.min.js';

@Component({
	selector: 'app-showroom-element',
	templateUrl: './showroom-element.component.html',
	styleUrls: ['./showroom-element.component.scss']
})
export class ShowroomElementComponent implements OnInit {
	@Input() name: string = null;
	@Input() siteurl: string = null;
	@Input() image: string = null;
	@Input() descFr: string = null;
	@Input() descEn: string = null;
	@Input() tech: string = null;

	constructor(public translate: TranslateService) {}

	getDescription(lang: string = this.translate.currentLang){
		if(!lang){
			return '';
		}
		lang = lang.charAt(0).toUpperCase() + lang.substr(1);
		return this['desc' + lang];
	}
	
	getShowroomElements(query: object = {}){
		
	}
	
	ngOnInit() {
	}
}
