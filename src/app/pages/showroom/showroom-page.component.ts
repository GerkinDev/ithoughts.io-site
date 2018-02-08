import { Component, ViewChild, ViewContainerRef, OnInit, AfterContentInit, ComponentFactoryResolver, Injector } from '@angular/core';
import { ShowroomElementComponent } from './showroom-element/showroom-element.component';
import * as $ from 'jquery';
const Diaspora = require( 'diaspora/dist/standalone/diaspora.min' );
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { OwlCarousel } from 'ngx-owl-carousel';
import { LoDashWrapper, LoDashExplicitArrayWrapper } from 'lodash';

@Component({
	selector: 'app-showroom-page',
	templateUrl: './showroom-page.component.html',
	styleUrls: ['./showroom-page.component.scss']
})
export class ShowroomPageComponent implements OnInit, AfterContentInit {
	@ViewChild('showroom', { read: OwlCarousel }) showroom?: OwlCarousel;
	@ViewChild('showroom', { read: ViewContainerRef }) showroomRef?: ViewContainerRef;
	public listItems: Array<any> = [];
	private Showroom: any;

	constructor(private componentFactoryResolver: ComponentFactoryResolver) {
		Diaspora.createNamedDataSource('local', 'inMemory');
		this.Showroom = Diaspora.declareModel('Showroom', {
			sources: 'local',
			attributes: {
				name: 'string',
				siteurl: 'string',
				image: 'string',
				descFr: 'string',
				descEn: 'string',
				tech: {
					type: 'string',
					enum: [
						'Angular2',
						'Symfony4',
						'Wordpress',
						'Prestashop',
					],
				}
			},
		});
	}

	public async getShowroomElements(query: object = {}) {
		return await this.Showroom.findMany(query);
	}

	async ngOnInit() {
		const col = this.Showroom.spawnMany(environment.showroom);
		const showroomElements: LoDashExplicitArrayWrapper<{attributes: any}> = await col.persist();
		this.listItems = showroomElements.map('attributes').value();

		if (this.showroom) {
			setTimeout(() => this.showroom ? this.showroom.trigger('refresh.owl.carousel') : null, 1000);
			console.log({
				showroom: this.showroom,
				showroomRef: this.showroomRef
			});
			(window as any).showroom = this.showroom;
			/*const componentFactory = this.componentFactoryResolver
			.resolveComponentFactory(ShowroomElementComponent);

			const items = showroomElements.map((item: any) => {
				const componentRef = (this.showroomRef as ViewContainerRef).createComponent(componentFactory);
				const component = componentRef.instance;
				console.log({component, componentRef}, componentRef.hostView);
				_.assign(component, item.attributes);
				(this.showroom as OwlCarousel).trigger('add.owl.carousel', [componentRef.hostView, 0]);
				return component;
			}).value();*/
//			console.log(items);
//			this.showroom.trigger('add.owl.carousel', items);
		}

		// We create an injector out of the data we want to pass down and this components injector
	}

	ngAfterContentInit() {
		// Inputs need to be in the following format to be resolved properly
		/*let inputProviders = Object.keys(data.inputs).map((inputName) => {return {provide: inputName, useValue: data.inputs[inputName]};});
		let resolvedInputs = ReflectiveInjector.resolve(inputProviders);*/

		/*		const inputs = [];

		// We create an injector out of the data we want to pass down and this components injector
		const injector = Injector.create(inputs);

		const factory = this.resolver.resolveComponentFactory(ShowroomElementComponent);
		console.log(factory);
		const component = factory.create(injector);
		this.showroom.insert(component.hostView);
		/*		const r = mod.componentFactoryResolver;
		const cmpFactory = r.resolveComponentFactory(AComponent);

		// create a component and attach it to the view
		const componentRef = cmpFactory.create(this._injector);
		this.container.insert(componentRef.hostView);*/
		/*const factory = this.componentFactoryResolver.resolveComponentFactory(ShowroomElementComponent);
		const ref = this.viewContainerRef.createComponent(factory);

		console.log({factory, ref});*/
		/*
		const showroomEl = this.showroomEl.nativeElement;
		console.log(showroomEl);
		console.log($(showroomEl).find('.owl-carousel'))
		$(showroomEl).css({visibility: 'visible'}).find('.owl-carousel').css({ display:'block' });*/
	}

}
