import { Injectable } from '@angular/core';
import { Diaspora, Model, EFieldType } from '@diaspora/diaspora';
import { IShowroom, environment } from '../../../environments/environment.common';
import * as _ from 'lodash';

@Injectable()
export class ShowroomService {
	public Showroom: Model<IShowroom>;
	public showroomReady: Promise<any>;
	
	public constructor() {
		Diaspora.createNamedDataSource( 'local', 'inMemory' );
		this.Showroom = Diaspora.declareModel<IShowroom>( 'Showroom', {
			sources: 'local',
			attributes: {
				name: {
					type: EFieldType.STRING,
					required: true,
				},
				siteurl: EFieldType.STRING,
				image: EFieldType.STRING,
				descFr: EFieldType.STRING,
				descEn: EFieldType.STRING,
				type: {
					type: EFieldType.STRING,
					enum: [
						'Lib',
						'Site',
					],
					required: true,
				},
				tags: {
					type: EFieldType.ARRAY,
					of: {
						type: EFieldType.STRING,
						enum: [
							'Angular2',
							'Symfony4',
							'Wordpress',
							'Prestashop',
						],
					},
				},
			},
		} );


		const assignToAll = <TItems, TNew>( items: TItems[], toMerge: TNew ) =>
		_.map( items, _.unary( _.partialRight( _.assign, toMerge ) as <T>( item: T ) => T & TNew ) );
		const showroomElements = _.flatten( [
			assignToAll( environment.showroom.sites, {type: 'Site'} ),
			assignToAll( environment.showroom.libs, {type: 'Lib'} ),
		] );

		this.showroomReady = this.Showroom.insertMany( showroomElements );
	}
}
