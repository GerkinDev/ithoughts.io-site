import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'app-translatable',
	template: '',
})
export class AppTranslatableComponent {
	constructor(public translate: TranslateService) {
		this.translate.addLangs(['en', 'fr', 'xx']);
		// Set the default language for translation strings, and the current language.
		this.translate.setDefaultLang('en');

		const localLang = localStorage.getItem('lang');
		const browserLang = this.translate.getBrowserLang();
		if (localLang) {
			this.translate.use(localLang);
		} else if (browserLang !== undefined) {
			this.translate.use(browserLang);
		} else {
			this.translate.use('en'); // Set your language here
		}
	}
	changeLang(lang: string) {
		this.translate.use(lang);
		if (lang === this.translate.getBrowserLang()) {
			localStorage.removeItem('lang');
		} else {
			localStorage.setItem('lang', lang);
		}
	}
}
