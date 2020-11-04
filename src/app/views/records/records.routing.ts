import { Routes } from '@angular/router';
import { RecordsOverviewComponent } from './records-overview/records-overview.component';
import { RecordsListComponent } from './records-list/records-list.component';

export const RecordsRoutes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: '',
      //   component: RecordsOverviewComponent,
      //   data: { title: 'Overview', breadcrumb: 'OVERVIEW' }
      // },
      {
        path: '',
        component: RecordsListComponent,
        data: { title: 'List', breadcrumb: 'LIST' }
      }
    ]
  }
];
