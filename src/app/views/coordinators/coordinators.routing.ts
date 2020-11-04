import { Routes } from '@angular/router';
import { CoordinatorsOverviewComponent } from './coordinators-overview/coordinators-overview.component';
import { CoordinatorDetailsComponent } from './coordinator-details/coordinator-details.component';
import { CoordinatorsListComponent } from './coordinators-list/coordinators-list.component';
import { CoordinatorEditComponent } from './coordinator-edit/coordinator-edit.component';
import { CoordinatorApplicationsComponent } from './coordinator-applications/coordinator-applications.component';

export const CoordinatorsRoutes: Routes = [
  {
    path: '',
    children: [
      //   {
      //   path: '',
      //   component: CoordinatorsOverviewComponent,
      //   data: { title: 'Overview', breadcrumb: 'OVERVIEW'}
      // },
      // {
      //   path: 'applications',
      //   component: CoordinatorApplicationsComponent,
      //   data: { title: 'Applications', breadcrumb: 'APPLICATIONS'}
      // },
      {
        path: 'list',
        redirectTo: ''
      },
      {
        path: '',
        component: CoordinatorsListComponent,
        data: { title: 'List', breadcrumb: 'LIST' },
      },
      {
        path: 'new',
        component: CoordinatorEditComponent,
        data: { title: 'New', breadcrumb: 'NEW' },
      },
      {
        path: ':id',
        component: CoordinatorDetailsComponent,
        data: { title: 'Detail', breadcrumb: 'DETAIL' },
      },
      {
        path: ':id/edit',
        component: CoordinatorEditComponent,
        data: { title: 'Edit', breadcrumb: 'EDIT' },
      },
    ],
  },
];
