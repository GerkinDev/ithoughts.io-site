// ====== ./app/app.routes.ts ======

// Imports
// Deprecated import
// import { provideRouter, RouterConfig } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexPageComponent } from './pages/index/index-page.component';
import { AboutPageComponent } from './pages/about/about-page.component';
import { ShowroomPageComponent } from './pages/showroom/showroom-page.component';
// import { DogListComponent } from './dogs/dog-list.component';

// Route Configuration
export const routes: Routes = [
	{ path: '', component: IndexPageComponent },
	{ path: 'about', component: AboutPageComponent },
	{ path: 'showroom', component: ShowroomPageComponent },
	// { path: '', component: IndexPageComponent },
];

// Deprecated provide
// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes)
// ];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
