import { Component, ViewChild, ViewContainerRef, OnInit, AfterContentInit, ComponentFactoryResolver, Injector } from '@angular/core';
import { ShowroomElementComponent } from './showroom-element/showroom-element.component';
import * as $ from 'jquery';
const Diaspora = require( 'diaspora/dist/standalone/diaspora.min' );
import * as _ from 'lodash';

import { environment} from '../../../environments/environment';
import { IIthoughtsEnvironment, IShowroomElement } from '../../../environments/environment.common';

import { OwlCarousel } from 'ngx-owl-carousel';
import { LoDashWrapper, LoDashExplicitArrayWrapper, Dictionary, ValueIteratee } from 'lodash';
import { Router, ActivatedRoute, Params } from '@angular/router';


type ObjOrArr<T> = {[key: string]: T} | T[];

interface ISearch {
	tags: string[];
}

@Component({
	selector: 'app-showroom-page',
	templateUrl: './showroom-page.component.html',
	styleUrls: ['./showroom-page.component.scss']
})
export class ShowroomPageComponent {
	@ViewChild('showroomSites', { read: OwlCarousel }) showroomSites?: OwlCarousel;
	@ViewChild('showroomLibs', { read: OwlCarousel }) showroomLibs?: OwlCarousel;
    public currentShowroomSitesElements: Array<IShowroomElement> = [];
	public allShowroomSitesElements: Array<IShowroomElement> = [];
	public currentShowroomLibsElements: Array<IShowroomElement> = [];
	public allShowroomLibsElements: Array<IShowroomElement> = [];
	private search: ISearch = {tags: []};
	private Showroom: any;
	
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {
		Diaspora.createNamedDataSource('local', 'inMemory');
		this.Showroom = Diaspora.declareModel('Showroom', {
			sources: 'local',
			attributes: {
				name: 'string',
				siteurl: 'string',
				image: 'string',
				descFr: 'string',
				descEn: 'string',
				techs: {
					type: 'array',
					of: {
						enum: [
							'Angular2',
							'Symfony4',
							'Wordpress',
							'Prestashop',
						],
					}
				}
			},
		});
		this.activatedRoute.queryParams.subscribe(this.onParamsReady.bind(this));
	}
    
    private filterShowroomElements(showroomElement: IShowroomElement){
        if(this.search.tags.length === 0){
            return true;
        }
        return _.intersection(showroomElement.tags, this.search.tags).length > 0;
    }

    private initShowroom(showroomItems: IShowroomElement[], showroom?: OwlCarousel){
        const showroomFiltered = _.filter(showroomItems, this.filterShowroomElements.bind(this));
        console.log({showroomItems, showroomFiltered})
        if(showroom){
            showroom.reInit();
        }
        return showroomFiltered;
    }

	private onParamsReady(params: Params){
		this.search = _.assign({tags: []}, params);
		
		this.allShowroomSitesElements = environment.showroom.sites;
        this.allShowroomLibsElements = environment.showroom.libs;
        
		this.currentShowroomSitesElements = this.initShowroom(this.allShowroomSitesElements, this.showroomSites);
		this.currentShowroomLibsElements = this.initShowroom(this.allShowroomLibsElements, this.showroomLibs);
	}
    
	/**
	* Deep diff between two object, using lodash
	* @param  {Object} obj Object compared
	* @param  {Object} base   Object to compare with
	* @return {Object}        Return a new object who represent the diff
	*/
	private differenceArrays<T,U>(obj: ObjOrArr<T>, base: ObjOrArr<U>) {
		const reduction = _(obj)
		.reduce((acc, value, key) => {
			const duplicate = _.filter(base, otherValue => {
				const areEqual = _.isEqual(value, otherValue);
				//console.log({value, otherValue, areEqual})
				return !areEqual;
			});
			//console.log({acc, value, key, duplicate})
			return _.concat(acc, duplicate);
		}, [] as (T | U)[]);
		return reduction;
	}
	
	private reloadCarousel(){
		//console.log('Trigger reload');
		if(this.showroomSites){
			this.showroomSites.reInit();
		}
	}
    
	public addSearchTag(label: string){
        this.search.tags.push(label);
		this.search.tags = _.uniq(this.search.tags);
		this.router.navigate(['showroom'], { queryParams: this.search });
	}
	
	public clearSearchTag(label: string){
        this.search.tags = _.filter(this.search.tags, label);
		this.router.navigate(['showroom'], { queryParams: this.search });
    }
    
	public clearSearchTags(){
        this.search.tags = [];
		this.router.navigate(['showroom'], { queryParams: this.search });
	}
}
