import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        data: { title: 'Dashboard', breadcrumb: 'DASHBOARD' },
      },
      {
        path: 'league',
        loadChildren: () =>
          import('./views/league/league.module').then((m) => m.LeagueModule),
        data: { title: 'League', breadcrumb: 'LEAGUE' },
      },
      {
        path: 'news',
        loadChildren: () =>
          import('./views/news/news.module').then((m) => m.NewsModule),
        data: { title: 'News', breadcrumb: 'NEWS' },
      },
      {
        path: 'meets',
        loadChildren: () =>
          import('./views/meets/meets.module').then((m) => m.MeetsModule),
        data: { title: 'Meets', breadcrumb: 'MEETS' },
      },
      {
        path: 'members',
        loadChildren: () =>
          import('./views/members/members.module').then((m) => m.MembersModule),
        data: { title: 'Members', breadcrumb: 'MEMBERS' },
      },
      {
        path: 'memberships',
        loadChildren: () =>
          import('./views/memberships/memberships.module').then(
            (m) => m.MembershipsModule
          ),
        data: { title: 'Memberships', breadcrumb: 'MEMBERSHIPS' },
      },
      {
        path: 'coordinators',
        loadChildren: () =>
          import('./views/coordinators/coordinators.module').then(
            (m) => m.CoordinatorsModule
          ),
        data: { title: 'Coordinators', breadcrumb: 'COORDINATORS' },
      },
      {
        path: 'records',
        loadChildren: () =>
          import('./views/records/records.module').then((m) => m.RecordsModule),
        data: { title: 'Records', breadcrumb: 'RECORDS' },
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        data: { title: 'Dashboard', breadcrumb: 'DASHBOARD' },
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./views/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
        data: { title: 'Settings', breadcrumb: 'SETTINGS' },
      },
      // {
      //   path: 'gallery',
      //   loadChildren: () =>
      //     import('./views/gallery/gallery.module').then((m) => m.GalleryModule),
      //   data: { title: 'Gallery', breadcrumb: 'GALLERY' },
      // },
    ],
  },
  {
    path: '',
    loadChildren: () =>
      import('./views/auth/auth.module').then((m) => m.AuthModule),
    data: { title: 'Auth' },
  },
  {
    path: '',
    loadChildren: () =>
      import('./views/utility/utility.module').then((m) => m.UtilityModule),
    data: { title: 'Utility' },
  },
];
