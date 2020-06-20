import {NgModule} from '@angular/core';

import {ThemeModule} from '../../@theme/theme.module';
import {PatientsRoutingModule, routedComponents} from './patients-routing.module';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {PatientAntecedentComponent} from './patient-view/patient-antecedent/patient-antecedent.component';
import {PatientService} from '../../@core/services/patient.service';
import {PendingChangesGuard} from '../../@core/utils/pending-changes.guard';
import {GroupByPipe} from '../../@core/pipes/group-by.directive';
import {AgePipe} from '../../@core/pipes/age.directive';
import {MiscellaneousModule} from '../miscellaneous/miscellaneous.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {CKEditorModule} from 'ng2-ckeditor';
import {ModalConfirmComponent} from '../ui-features/modals/modal-confirm/modal-confirm.component';
import {DatePipe} from '@angular/common';
import {PatientInvoiceModalComponent} from './patient-view/patient-invoice-modal/patient-invoice-modal.component';
import {
  NbAccordionModule,
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbMenuModule,
  NbRadioModule,
  NbSelectModule,
  NbTabsetModule,
  NbToastrModule,
  NbUserModule,
} from '@nebular/theme';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    PatientsRoutingModule,
    BsDatepickerModule.forRoot(),
    MiscellaneousModule,
    NgxPaginationModule,
    CKEditorModule,
    NbTabsetModule,
    NbCardModule,
    NbMenuModule,
    FormsModule,
    NbFormFieldModule,
    ThemeModule,
    NbInputModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbSelectModule,
    NbIconModule,
    NbToastrModule.forRoot({
      duration: 10000,
    }),
    NbAccordionModule,
  ],
  declarations: [
    ...routedComponents,
    ModalConfirmComponent,
    PatientInvoiceModalComponent,
    PatientAntecedentComponent,
    GroupByPipe,
    AgePipe,
  ],
  entryComponents: [
    ModalConfirmComponent,
    PatientInvoiceModalComponent,
  ],
  providers: [
    PatientService,
    PendingChangesGuard,
    DatePipe,
  ],
})
export class PatientsModule {
}
