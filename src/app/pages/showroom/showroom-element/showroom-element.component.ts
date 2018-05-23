import { Input, Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-showroom-element',
	templateUrl: './showroom-element.component.html',
	styleUrls: ['./showroom-element.component.scss']
})
export class ShowroomElementComponent {
	@ViewChild('hoverInfos') hoverInfos?: ElementRef;
	@ViewChild('fullInfos') fullInfos?: ElementRef;
	@Input() name?: string;
	@Input() siteurl?: string;
	@Input() image?: string;
	@Input() descFr?: string;
	@Input() descEn?: string;
	@Input() tags?: string[];
	private inFullScreen = false;

	constructor(private translate: TranslateService, private el: ElementRef) {}

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

	filterBy(tag: string) {
		this.el.nativeElement
		.dispatchEvent(new CustomEvent('filter-change', {
			detail: tag,
			bubbles: true
		}));
	}

	closeFullScreen(event: Event) {
		this.inFullScreen = false;
		console.log('Closing fs', this.fullInfos, event)
		if (this.fullInfos) {
			(this.fullInfos.nativeElement as HTMLElement).classList.remove('active');
		}
		this.el.nativeElement
		.dispatchEvent(new CustomEvent('close-full-view', {
			bubbles: true
		}));
		event.stopImmediatePropagation();
	}
	
	@HostListener('mouseenter')
	mouseOnShortInfos() {
		if (!this.inFullScreen && this.hoverInfos) {
			(this.hoverInfos.nativeElement as HTMLElement).classList.add('active');
		}
		this.el.nativeElement
		.dispatchEvent(new CustomEvent('cursor-move', {
			detail: {
				newTarget: this.el.nativeElement,
				position: $(this.el.nativeElement).position()
			},
			bubbles: true
		}));
	}

	@HostListener('mouseleave')
	mouseOutShortInfos() {
		if (!this.inFullScreen && this.hoverInfos) {
			(this.hoverInfos.nativeElement as HTMLElement).classList.remove('active');
		}
		this.el.nativeElement
		.dispatchEvent(new CustomEvent('cursor-maybe-leave', {
			bubbles: true
		}));
	}

	@HostListener('click')
	openFullView() {
		console.log('Hey there! Opening me in full view:', this);
		this.inFullScreen = true;
		if (this.hoverInfos) {
			(this.hoverInfos.nativeElement as HTMLElement).classList.remove('active');
		}
		setTimeout(() => {
			if (this.fullInfos) {
				(this.fullInfos.nativeElement as HTMLElement).classList.add('active');
			}
		}, 500);
		this.el.nativeElement
		.dispatchEvent(new CustomEvent('open-full-view', {
			detail: {
				target: this,
			},
			bubbles: true
		}));
	}
}
