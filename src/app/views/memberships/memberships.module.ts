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
  MatAutocompleteModule
 } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { MembershipsRoutes } from './memberships.routing';
import { MembershipsOverviewComponent } from './memberships-overview/memberships-overview.component';
import { MembershipDetailsComponent } from './membership-details/membership-details.component';
import { MembershipEditComponent } from './membership-edit/membership-edit.component';
import { QuillModule } from 'ngx-quill';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { MembershipsListComponent } from './memberships-list/memberships-list.component';



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
    MatAutocompleteModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatStepperModule,
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
    RouterModule.forChild(MembershipsRoutes)
  ],
  declarations: [
    MembershipsOverviewComponent,
    MembershipEditComponent,
    MembershipsListComponent,
    MembershipDetailsComponent],
  exports: []
})
export class MembershipsModule {

}
