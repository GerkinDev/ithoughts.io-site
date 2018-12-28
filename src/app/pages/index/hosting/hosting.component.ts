import { Component, ViewChild, AfterContentInit, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { OwlCarousel } from 'ngx-owl-carousel';
// import { setTimeout } from 'timers';

@Component({
	selector: 'app-web-hosting',
	templateUrl: './hosting.component.html',
	styleUrls: ['./hosting.component.scss'],
	host: { 'class': 'padder' }
})
export class HostingComponent implements AfterContentInit, OnInit {
	@ViewChild('owlElement') owlElement?: OwlCarousel;

	ngAfterContentInit() {
		console.log('ngAfterContentInit');
		console.log(this.owlElement);
		if (this.owlElement) {
			const carouselEl = this.owlElement;
			(window as any).carousel = carouselEl;
			setTimeout(() => carouselEl.trigger('refresh.owl.carousel'), 0);
		}
	}
	ngOnInit() {
		console.log('ngOnInit');
	}
}
