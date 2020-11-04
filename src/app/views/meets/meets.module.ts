import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { 
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatChipsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatListModule,
  MatSidenavModule,
  MatRippleModule,
  MatDatepickerModule, 
  MatNativeDateModule,
  MatProgressBarModule,
  MatStepperModule,
  MatTableModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatProgressSpinnerModule
 } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { MeetsRoutes } from './meets.routing';
import { MeetsOverviewComponent } from './meets-overview/meets-overview.component';
import { MeetDetailsComponent } from './meet-details/meet-details.component';
import { MeetEditComponent } from './meet-edit/meet-edit.component';
import { QuillModule } from 'ngx-quill';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { MeetsListComponent } from './meets-list/meets-list.component';
import { MeetRegistrantsEditComponent } from './meet-registrants-edit/meet-registrants-edit.component';
import { MeetRegistrantsComponent } from './meet-registrants/meet-registrants.component';
import { MeetResultsComponent } from './meet-results/meet-results.component';
import { MeetAddRegistrantPopupComponent } from './meet-details/meet-add-registrant-popup/meet-add-registrant-popup.component';
import { MeetResultsPopupComponent } from './meet-details/meet-results-popup/meet-results-popup.component';
import { AgmCoreModule } from '@agm/core';
import { MeetRegistrantsPopupComponent } from './meet-registrants/meet-registrants-popup/meet-registrants-popup.component';
import { MeetRequestsComponent } from './meet-requests/meet-requests.component';
import { MeetRequestsPopupComponent } from './meet-requests/meet-requests-popup/meet-requests-popup.component';
import { MeetResultEditPopupComponent } from './meet-details/meet-result-edit-popup/meet-result-edit-popup.component';
import { MeetRequestsEditComponent } from './meet-requests-edit/meet-requests-edit.component';



@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatRippleModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatListModule,
    MatSidenavModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatProgressBarModule,
    MatTableModule,
    MatDialogModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatListModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    ChartsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    QuillModule,
    FileUploadModule,
    FormsModule,
    SharedPipesModule,
    MatTooltipModule,
    RouterModule.forChild(MeetsRoutes),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCIaV7uW7BaXC6EaMv9YkHYb6fIAXYhH-M' }),
  ],
  declarations: [
    MeetsOverviewComponent,
    MeetDetailsComponent,
    MeetEditComponent,
    MeetsListComponent,
    MeetRegistrantsEditComponent,
    MeetRegistrantsComponent,
    MeetResultsComponent,
    MeetAddRegistrantPopupComponent,
    MeetResultsPopupComponent,
    MeetRegistrantsPopupComponent,
    MeetRequestsComponent,
    MeetRequestsPopupComponent,
    MeetResultEditPopupComponent,
    MeetRequestsEditComponent
  ],
  exports: [],
  entryComponents: [
    MeetAddRegistrantPopupComponent,
    MeetResultsPopupComponent,
    MeetRegistrantsComponent,
    MeetRequestsPopupComponent,
    MeetResultEditPopupComponent
  ]
})
export class MeetsModule {

}
