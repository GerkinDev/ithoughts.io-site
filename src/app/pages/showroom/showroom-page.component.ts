import { ShowroomService } from './../../services/showroom/showroom.service';
import { Component, ViewChild, ViewContainerRef, OnInit, AfterContentInit, ComponentFactoryResolver, Injector, HostListener } from '@angular/core';
import { ShowroomElementComponent } from './showroom-element/showroom-element.component';
import { Diaspora, Model, EFieldType, Set as EntitySet } from '@diaspora/diaspora';
import * as _ from 'lodash';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { environment} from '../../../environments/environment';
import { IIthoughtsEnvironment, IShowroom } from '../../../environments/environment.common';

import { LoDashWrapper, LoDashExplicitArrayWrapper, Dictionary, ValueIteratee } from 'lodash';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { TilerComponent } from '../../tiler/tiler.component';


type ObjOrArr<T> = {[key: string]: T} | T[];

interface ISearch {
	tags: string[];
}

@Component( {
	selector: 'app-showroom-page',
	templateUrl: './showroom-page.component.html',
	styleUrls: ['./showroom-page.component.scss'],
	providers: [ShowroomService],
} )
export class ShowroomPageComponent {
	public currentShowroomSitesElements: EntitySet<IShowroom>;
	public currentShowroomLibsElements: EntitySet<IShowroom>;
	
	@ViewChild( 'sitesTiler' ) public sitesTiler?: TilerComponent;
	@ViewChild( 'libsTiler' ) public libsTiler?: TilerComponent;
	
	private search: ISearch = {tags: []};
	
	public constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private showroomService: ShowroomService
	) {
		this.currentShowroomLibsElements = new EntitySet( this.showroomService.Showroom );
		this.currentShowroomSitesElements = new EntitySet( this.showroomService.Showroom );
		
		this.showroomService.showroomReady.then( () => {
			this.activatedRoute.queryParamMap.subscribe( params => this.onParamsReady( params ) );
		} );
	}
	
	private applySearch( typeFilter: 'Lib' | 'Site', items: any[] ) {
		return this.showroomService.Showroom.spawnMany( _.chain( items ).filter( entity => {
			if ( entity && entity.type === typeFilter ) {
				return this.search.tags.length === 0 || _.intersection( entity.tags, this.search.tags ).length > 0;
			}
			return false;
		} ).map( item => _.omit( item, ['id', 'idHash'] ) ).value() );
	}
	
	private async onParamsReady( params: ParamMap ) {
		console.log( 'OnParamsReady', params );
		if ( this.sitesTiler ) {
			this.sitesTiler.leaveFullView();
		}
		if ( this.libsTiler ) {
			this.libsTiler.leaveFullView();
		}
		// console.log(params.getAll('tags'));
		this.search = {tags: params.getAll( 'tags' )};
		if ( typeof this.search.tags === 'string' ) {
			this.search.tags = [this.search.tags];
		}
		
		const tagsSearch = this.search.tags.length > 0 ? {tags: {$contains: this.search.tags[0]}} : {};
		
		const items = ( this.showroomService.Showroom.dataSources['local'].adapter as any ).store.Showroom.items as any[];
		this.currentShowroomLibsElements = this.applySearch( 'Lib', items );
		this.currentShowroomSitesElements = this.applySearch( 'Site', items );
		/*[
			this.currentShowroomSitesElements,
			this.currentShowroomLibsElements
		] = await Promise.all([
			(this.Showroom.dataSources['local'].adapter as InMemoryAdapter).store.Showroom,
			this.Showroom.findMany(_.assign({type: 'Lib'}, tagsSearch))
		]);*/
		
		setTimeout( () => {
			if ( this.sitesTiler ) {
				this.sitesTiler.bindChildren();
				this.sitesTiler.reloadCursorPosition();
			}
			if ( this.libsTiler ) {
				this.libsTiler.bindChildren();
				this.libsTiler.reloadCursorPosition();
			}
		},          100 );
	}
	
	@HostListener( 'filter-add', ['$event'] )
	public async addSearchTag( event: CustomEvent ) {
		const label = event.detail as string;
		console.log( 'Add search tag', label );
		console.log( 'Old search:', _.cloneDeep( this.search ) );
		this.search.tags.push( label );
		this.search.tags = _.uniq( this.search.tags );
		console.log( 'New search:', _.cloneDeep( this.search ) );
		
		this.reloadWithSearch();
	}
	
	public clearSearchTag( label: string ) {
		console.log( 'Clearing search tag', label );
		this.search.tags = _.difference( this.search.tags, [label] );
		console.log( _.cloneDeep( this.search ) );
		
		this.reloadWithSearch();
	}
	
	private async reloadWithSearch() {
		const search = _.cloneDeep( this.search );
		const navigateRes = await this.router.navigate( ['showroom'], {
			queryParams: {},
			skipLocationChange: true,
			// queryParamsHandling: 'preserve'
		} );
		const navigateRes2 = await this.router.navigate( ['showroom'], {
			queryParams: search,
			
			// queryParamsHandling: 'preserve'
		} );
		console.log( '> NavigateRes:', {navigateRes, navigateRes2} );
	}
	
	public clearSearchTags() {
		this.search.tags = [];
		this.router.navigate( ['showroom'], { queryParams: this.search } );
	}
}
