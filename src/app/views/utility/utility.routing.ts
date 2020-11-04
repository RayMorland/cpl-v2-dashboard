import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

export const UtilityRoutes: Routes = [{
  path: '',
  children: [{
    path: '**',
    component: NotFoundComponent
  }]
}];
