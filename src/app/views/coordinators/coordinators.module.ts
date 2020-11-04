import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
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
  MatAutocompleteModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatStepperModule,
  MatGridListModule,
  MatTableModule,
  MatDialogModule,
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ChartsModule } from "ng2-charts";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedPipesModule } from "app/shared/pipes/shared-pipes.module";
import { CoordinatorsRoutes } from "./coordinators.routing";
import { CoordinatorsOverviewComponent } from "./coordinators-overview/coordinators-overview.component";
import { CoordinatorDetailsComponent } from "./coordinator-details/coordinator-details.component";
import { CoordinatorEditComponent } from "./coordinator-edit/coordinator-edit.component";
import { QuillModule } from "ngx-quill";
import { FileUploadModule } from "ng2-file-upload/ng2-file-upload";
import { CoordinatorsListComponent } from "./coordinators-list/coordinators-list.component";
import { CoordinatorApplicationsComponent } from "./coordinator-applications/coordinator-applications.component";
import { CoordinatorApplicationPopupComponent } from "./coordinator-applications/coordinator-application-popup/coordinator-application-popup.component";
import { ViewCoordinatorMeetComponent } from "./coordinator-details/view-coordinator-meet/view-coordinator-meet.component";
import { ViewCoordinatorInvoiceComponent } from "./coordinator-details/view-coordinator-invoice/view-coordinator-invoice.component";

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
    MatTableModule,
    MatGridListModule,
    FlexLayoutModule,
    ChartsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatDialogModule,
    QuillModule,
    MatProgressSpinnerModule,
    FileUploadModule,
    FormsModule,
    SharedPipesModule,
    RouterModule.forChild(CoordinatorsRoutes),
  ],
  declarations: [
    CoordinatorsOverviewComponent,
    CoordinatorDetailsComponent,
    CoordinatorEditComponent,
    CoordinatorsListComponent,
    CoordinatorApplicationsComponent,
    CoordinatorApplicationPopupComponent,
    ViewCoordinatorMeetComponent,
    ViewCoordinatorInvoiceComponent,
  ],
  exports: [],
  entryComponents: [
    CoordinatorApplicationPopupComponent,
    ViewCoordinatorMeetComponent,
    ViewCoordinatorInvoiceComponent,
  ],
})
export class CoordinatorsModule {}
