import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  MatDatepickerModule, MatProgressSpinnerModule
 } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { RecordsRoutes } from './records.routing';
import { RecordsOverviewComponent } from './records-overview/records-overview.component';
import { RecordsListComponent } from './records-list/records-list.component';
import { RecordEditPopupComponent } from './records-list/record-edit-popup/record-edit-popup.component';



@NgModule({
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
    MatProgressSpinnerModule,
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
    RouterModule.forChild(RecordsRoutes)
  ],
  declarations: [
    RecordsOverviewComponent,
    RecordsListComponent,
    RecordEditPopupComponent
  ],
  exports: [],
  entryComponents: [
    RecordEditPopupComponent
  ]
})
export class RecordsModule {

}
