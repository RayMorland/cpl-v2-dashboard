import { Routes } from '@angular/router';
import { NewsOverviewComponent } from './news-overview/news-overview.component';
import { NewsListComponent } from './news-list/news-list.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { NewsDetailsComponent } from './news-details/news-details.component';

export const NewsRoutes: Routes = [
  {
    path: '',
    children: [
    //   {
    //   path: '',
    //   component: NewsOverviewComponent,
    //   data: { title: 'Overview', breadcrumb: 'OVERVIEW'}
    // }, 
    {
      path: '',
      component: NewsListComponent,
      data: { title: 'List', breadcrumb: 'LIST'}
    }, {
      path: 'new',
      component: NewsEditComponent,
      data: { title: 'New', breadcrumb: 'NEW'}
    }, {
      path: ':id',
      component: NewsDetailsComponent,
      data: { title: 'Detail', breadcrumb: 'DETAIL'}
    }, {
      path: ':id/edit',
      component: NewsEditComponent,
      data: { title: 'Edit', breadcrumb: 'EDIT'}
    }]
  }
];
