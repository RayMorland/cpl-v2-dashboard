import { Routes } from '@angular/router';
import { MembershipsOverviewComponent } from './memberships-overview/memberships-overview.component';
import { MembershipsListComponent } from './memberships-list/memberships-list.component';
import { MembershipEditComponent } from './membership-edit/membership-edit.component';
import { MembershipDetailsComponent } from './membership-details/membership-details.component';

export const MembershipsRoutes: Routes = [
  {
    path: '',
    children: [
    //   {
    //   path: '',
    //   component: MembershipsOverviewComponent,
    //   data: { title: 'Overview', breadcrumb: 'OVERVIEW'}
    // }, 
    {
      path: '',
      component: MembershipsListComponent,
      data: { title: 'List', breadcrumb: 'LIST'}
    }, {
      path: 'new',
      component: MembershipEditComponent,
      data: { title: 'New', breadcrumb: 'NEW'}
    }, {
      path: ':id',
      component: MembershipDetailsComponent,
      data: { title: 'Detail', breadcrumb: 'DETAIL'}
    }, {
      path: ':id/edit',
      component: MembershipEditComponent,
      data: { title: 'Edit', breadcrumb: 'EDIT'}
    }]
  }
];
