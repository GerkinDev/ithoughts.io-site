import { TestBed, inject } from '@angular/core/testing';

import { ShowroomService } from './showroom.service';

describe( 'ShowroomService', () => {
	beforeEach( () => {
		TestBed.configureTestingModule( {
			providers: [ShowroomService],
		} );
	} );
	
	it( 'should be created', inject( [ShowroomService], ( service: ShowroomService ) => {
		expect( service ).toBeTruthy();
	} ) );
} );
