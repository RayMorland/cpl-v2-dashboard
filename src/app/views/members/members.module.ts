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
  MatTooltipModule,
  MatStepperModule,
  MatGridListModule,
  MatAutocompleteModule,
  MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, MatDialogModule
 } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { MembersRoutes } from './members.routing';
import { MembersOverviewComponent } from './members-overview/members-overview.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { QuillModule } from 'ngx-quill';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { MembersListComponent } from './members-list/members-list.component';
import { MeetRegistrantsComponent } from '../meets/meet-registrants/meet-registrants.component';
import { MeetAddRegistrantPopupComponent } from '../meets/meet-details/meet-add-registrant-popup/meet-add-registrant-popup.component';
import { MeetsModule } from '../meets/meets.module';
import { ViewMemberRegistrationPopupComponent } from './member-details/view-member-registration-popup/view-member-registration-popup.component';
import { ViewMemberRecordPopupComponent } from './member-details/view-member-record-popup/view-member-record-popup.component';
import { ViewMemberResultPopupComponent } from './member-details/view-member-result-popup/view-member-result-popup.component';
import { ViewMemberInvoicePopupComponent } from './member-details/view-member-invoice-popup/view-member-invoice-popup.component';

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
    MatTooltipModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatStepperModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
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
    RouterModule.forChild(MembersRoutes)
  ],
  declarations: [
    MemberDetailsComponent,
    MemberEditComponent,
    MembersListComponent,
    MembersOverviewComponent,
    ViewMemberRegistrationPopupComponent,
    ViewMemberRecordPopupComponent,
    ViewMemberResultPopupComponent,
    ViewMemberInvoicePopupComponent
  ],
  entryComponents: [
    ViewMemberRegistrationPopupComponent,
    ViewMemberRecordPopupComponent,
    ViewMemberResultPopupComponent,
    ViewMemberInvoicePopupComponent
  ],
  exports: []
})
export class MembersModule {

}
