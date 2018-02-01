import { Component, ViewChild, ViewContainerRef, AfterContentInit, ComponentFactoryResolver, Injector } from '@angular/core';
import { ShowroomElementComponent } from './showroom-element/showroom-element.component';
import * as $ from 'jquery';
import * as Diaspora from 'diaspora/dist/standalone/diaspora.min.js';
import * as _ from 'lodash';

@Component({
	selector: 'app-showroom-page',
	templateUrl: './showroom-page.component.html',
	styleUrls: ['./showroom-page.component.scss']
})
export class ShowroomPageComponent implements AfterContentInit {
	@ViewChild('showroom', { read: ViewContainerRef }) showroom: ViewContainerRef;
	private Showroom;

	constructor(private resolver: ComponentFactoryResolver) {
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
		const col = this.Showroom.spawnMany([
			{ name: 'iThoughts', tech: 'Angular2', siteUrl: 'https://ithoughts.io', descFr: 'Site corporate responsive avec Angular2 & Diaspora.' },
			{ name: 'Self 3D Print', tech: 'Symfony4', siteUrl: 'https://self3dprint.ithoughts.io', descFr: 'Vente en ligne d\'objets imprimés en 3D, où les utilisateurs peuvent imprimer leurs propres modèles. En développement.' },
			{ name: 'GerkinDevelopment', tech: 'Wordpress', siteUrl: 'https://www.gerkindevelopment.net', descFr: 'Blog d\'Alexandre Germain, basé sur un WordPress lourdement personnalisé.' },
			{ name: 'Art Aux Murs', tech: 'Prestashop', siteUrl: 'https://www.art-aux-murs.fr/', descFr: 'Vente en ligne de tableaux de fractales ou abstraits.' }
		]);
		const showroomElements = await col.persist();

		const factory = this.resolver.resolveComponentFactory(ShowroomElementComponent);
		showroomElements.forEach(item => {
			const attrs = item.attributes;
			const inputs  = <any>_(attrs).toPairs().map((input) => ({provide: input[0], useValue: input[1]})).value();
			console.log(inputs);
			const injector = Injector.create(inputs);

			const component = factory.create(this.showroom.parentInjector, inputs);
			this.showroom.insert(component.hostView);
		});

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
