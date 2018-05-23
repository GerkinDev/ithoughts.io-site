import { Component, ViewChild, ViewContainerRef, OnInit, AfterContentInit, ComponentFactoryResolver, Injector } from '@angular/core';
import { ShowroomElementComponent } from './showroom-element/showroom-element.component';
import * as $ from 'jquery';
import { Diaspora, Model, Entities } from '@diaspora/diaspora';
import { InMemoryAdapter } from '@diaspora/diaspora/dist/lib/adapters/inMemory';
import * as _ from 'lodash';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { environment} from '../../../environments/environment';
import { IIthoughtsEnvironment, IShowroomElement } from '../../../environments/environment.common';

import { LoDashWrapper, LoDashExplicitArrayWrapper, Dictionary, ValueIteratee } from 'lodash';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TilerComponent } from '../../tiler/tiler.component';


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
	public currentShowroomSitesElements: Entities.Set;
	public currentShowroomLibsElements: Entities.Set;

	@ViewChild('sitesTiler') sitesTiler?: TilerComponent;
	@ViewChild('libsTiler') libsTiler?: TilerComponent;

	private search: ISearch = {tags: []};
	private Showroom: Model;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {
		Diaspora.createNamedDataSource('local', 'inMemory');
		this.Showroom = Diaspora.declareModel('Showroom', {
			sources: 'local',
			attributes: {
				name: {
					type: 'string',
					required: true,
				},
				siteurl: 'string',
				image: 'string',
				descFr: 'string',
				descEn: 'string',
				type: {
					type: 'string',
					enum: [
						'Lib',
						'Site',
					],
					required: true,
				},
				tags: {
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
		this.currentShowroomLibsElements = new Entities.Set(this.Showroom);
		this.currentShowroomSitesElements = new Entities.Set(this.Showroom);

		const assignToAll = <TItems, TNew>(items: TItems[], toMerge: TNew) =>
		_.map(items,
			_.unary(_.partialRight(_.assign, toMerge) as <T>(item: T) => T & TNew));
			const showroomElements = _.flatten([
				assignToAll(environment.showroom.sites, {type: 'Site'}),
				assignToAll(environment.showroom.libs, {type: 'Lib'})
			]);
			this.Showroom.insertMany(showroomElements).then(() => {
				this.activatedRoute.queryParams.subscribe(params => this.onParamsReady(params));
			});
		}

		private applySearch(typeFilter: 'Lib' | 'Site', items: any[]) {
			return this.Showroom.spawnMany(_.chain(items).filter(entity => {
				if (entity && entity.type === typeFilter) {
					return this.search.tags.length === 0 || _.intersection(entity.tags, this.search.tags).length > 0;
				}
				return false;
			}).value());
		}

		private async onParamsReady(params: Params) {
			console.log('OnParamsReady');
			if (this.sitesTiler) {
				this.sitesTiler.leaveFullView();
			}
			if (this.libsTiler) {
				this.libsTiler.leaveFullView();
			}
			this.search = _.assign({tags: []}, params);
			if (typeof this.search.tags === 'string') {
				this.search.tags = [this.search.tags];
			}

			const tagsSearch = this.search.tags.length > 0 ? {tags: {$contains: this.search.tags[0]}} : {};

			const items = (this.Showroom.dataSources['local'].adapter as any).store.Showroom.items as any[];
			this.currentShowroomLibsElements = this.applySearch('Lib', items);
			this.currentShowroomSitesElements = this.applySearch('Site', items);
			/*[
				this.currentShowroomSitesElements,
				this.currentShowroomLibsElements
			] = await Promise.all([
				(this.Showroom.dataSources['local'].adapter as InMemoryAdapter).store.Showroom,
				this.Showroom.findMany(_.assign({type: 'Lib'}, tagsSearch))
			]);*/

			setTimeout(() => {
				if (this.sitesTiler) {
					this.sitesTiler.bindChildren();
					this.sitesTiler.reloadCursorPosition();
				}
				if (this.libsTiler) {
					this.libsTiler.bindChildren();
					this.libsTiler.reloadCursorPosition();
				}
			}, 100);
		}

		/**
		 * Deep diff between two object, using lodash
		 * @param  obj Object compared
		 * @param  base   Object to compare with
		 * @return Return a new object who represent the diff
		 */
		private differenceArrays<T, U>(obj: ObjOrArr<T>, base: ObjOrArr<U>) {
			const reduction = _(obj)
			.reduce((acc, value, key) => {
				const duplicate = _.filter(base, otherValue => {
					const areEqual = _.isEqual(value, otherValue);
					// console.log({value, otherValue, areEqual})
					return !areEqual;
				});
				// console.log({acc, value, key, duplicate})
				return _.concat(acc, duplicate);
			}, [] as (T | U)[]);
			return reduction;
		}

		public addSearchTag(label: string) {
			console.log('Add search tag', label);
			this.search.tags.push(label);
			this.search.tags = _.uniq(this.search.tags);
			console.log(this.search);
			this.router.navigate(['showroom'], { queryParams: this.search });
		}

		public clearSearchTag(label: string) {
			this.search.tags = _.filter(this.search.tags, label);
			this.router.navigate(['showroom'], { queryParams: this.search });
		}

		public clearSearchTags() {
			this.search.tags = [];
			this.router.navigate(['showroom'], { queryParams: this.search });
		}
	}


