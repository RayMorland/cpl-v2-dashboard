import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueOverviewComponent } from './league-overview/league-overview.component';
import { LeagueRoutes } from './league.routing';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { ReactiveFormsModule } from '@angular/forms';
import { 
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatGridListModule,
  MatExpansionModule,
  MatTabsModule,
  MatTableModule,
  MatDialogModule,
  MatInputModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatDatepickerModule, MatProgressSpinner, MatProgressSpinnerModule
 } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { LeagueEditPopupComponent } from './league-overview/league-edit-popup/league-edit-popup.component';

@NgModule({
  declarations: [
    LeagueOverviewComponent,
    LeagueEditPopupComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatGridListModule,
    MatInputModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatTabsModule,
    MatInputModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatListModule,
    MatProgressBarModule,
    MatTableModule,
    MatSelectModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    FlexLayoutModule,
    ChartsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    SharedPipesModule,
    FileUploadModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterModule.forChild(LeagueRoutes),
  ],
  entryComponents: [
    LeagueEditPopupComponent
  ]
})
export class LeagueModule { }
