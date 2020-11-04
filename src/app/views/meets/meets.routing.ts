import { Routes } from '@angular/router';
import { MeetsOverviewComponent } from './meets-overview/meets-overview.component';
import { MeetDetailsComponent } from './meet-details/meet-details.component';
import { MeetEditComponent } from './meet-edit/meet-edit.component';
import { MeetsListComponent } from './meets-list/meets-list.component';
import { MeetRegistrantsComponent } from './meet-registrants/meet-registrants.component';
import { MeetResultsComponent } from './meet-results/meet-results.component';
import { MeetRegistrantsEditComponent } from './meet-registrants-edit/meet-registrants-edit.component';
import { MeetRequestsComponent } from './meet-requests/meet-requests.component';

export const MeetsRoutes: Routes = [
  {
    path: '',
    children: [
    //   {
    //   path: '',
    //   component: MeetsOverviewComponent,
    //   data: { title: 'Overview', breadcrumb: 'OVERVIEW'}
    // }, 
    {
      path: '',
      component: MeetsListComponent,
      data: { title: 'List', breadcrumb: 'LIST'}
    }, {
      path: 'new',
      component: MeetEditComponent,
      data: { title: 'New', breadcrumb: 'NEW'}
    },  
    // {
    //   path: 'requests',
    //   component: MeetRequestsComponent,
    //   data: { title: 'Requests', breadcrumb: 'REQUESTS'}
    // }, 
    {
      path: ':id',
      component: MeetDetailsComponent,
      data: { title: 'Detail', breadcrumb: 'DETAIL'}
    }, {
      path: ':id/edit',
      component: MeetEditComponent,
      data: { title: 'Edit', breadcrumb: 'EDIT'}
    }, {
      path: ':id/registrants',
      component: MeetRegistrantsComponent,
      data: { title: 'Registrants', breadcrumb: 'REGISTRANTS'}
    }, {
      path: ':id/registrants/add',
      component: MeetRegistrantsEditComponent,
      data: { title: 'Add Registrant', breadcrumb: 'ADD'}
    }, {
      path: ':id/registrants/:id2/edit',
      component: MeetRegistrantsEditComponent,
      data: { title: 'Add Registrant', breadcrumb: 'EDIT'}
    }, {
      path: ':id/results',
      component: MeetResultsComponent,
      data: { title: 'Results', breadcrumb: 'RESULTS'}
    }]
  }
];
