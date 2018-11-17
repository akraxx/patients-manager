import {NgModule} from '@angular/core';

import {ThemeModule} from '../../@theme/theme.module';
import {PatientsRoutingModule, routedComponents} from './patients-routing.module';
import {AccordionModule, BsDatepickerModule} from 'ngx-bootstrap';
import {PatientAntecedentComponent} from './patient-view/patient-antecedent/patient-antecedent.component';
import {PatientService} from '../../@core/services/patient.service';
import {ToasterModule} from 'angular2-toaster';
import {PendingChangesGuard} from '../../@core/utils/pending-changes.guard';
import {GroupByPipe} from '../../@core/pipes/group-by.directive';
import {AgePipe} from '../../@core/pipes/age.directive';
import {MiscellaneousModule} from '../miscellaneous/miscellaneous.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {CKEditorModule} from 'ng2-ckeditor';
import {ModalConfirmComponent} from '../ui-features/modals/modal-confirm/modal-confirm.component';

@NgModule({
  imports: [
    ThemeModule,
    PatientsRoutingModule,
    BsDatepickerModule.forRoot(),
    ToasterModule.forRoot(),
    MiscellaneousModule,
    NgxPaginationModule,
    AccordionModule.forRoot(),
    CKEditorModule,
  ],
  declarations: [
    ...routedComponents,
    ModalConfirmComponent,
    PatientAntecedentComponent,
    GroupByPipe,
    AgePipe,
  ],
  entryComponents: [
    ModalConfirmComponent,
  ],
  providers: [
    PatientService,
    PendingChangesGuard,
  ],
})
export class PatientsModule {
}
