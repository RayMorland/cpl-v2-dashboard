import { Routes } from "@angular/router";
import { LeagueOverviewComponent } from './league-overview/league-overview.component';

export const LeagueRoutes: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: LeagueOverviewComponent,
            data: { title: 'Overview', breadcrumb: 'OVERVIEW' }
        }]
    }
]
