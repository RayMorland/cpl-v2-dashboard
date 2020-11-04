import { Routes } from '@angular/router';
import { MembersOverviewComponent } from './members-overview/members-overview.component';
import { MembersListComponent } from './members-list/members-list.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MemberEditComponent } from './member-edit/member-edit.component';

export const MembersRoutes: Routes = [
  {
    path: '',
    children: [
    //   {
    //   path: '',
    //   component: MembersOverviewComponent,
    //   data: { title: 'Overview', breadcrumb: 'OVERVIEW'}
    // }, 
    {
      path: '',
      component: MembersListComponent,
      data: { title: 'List', breadcrumb: 'LIST'}
    }, {
      path: 'new',
      component: MemberEditComponent,
      data: { title: 'New', breadcrumb: 'NEW'}
    }, {
      path: ':id',
      component: MemberDetailsComponent,
      data: { title: 'Detail', breadcrumb: 'DETAIL'}
    }, {
      path: ':id/edit',
      component: MemberEditComponent,
      data: { title: 'Edit', breadcrumb: 'EDIT'}
    }]
  }
];
