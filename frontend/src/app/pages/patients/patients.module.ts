import {NgModule} from '@angular/core';

import {ThemeModule} from '../../@theme/theme.module';
import {PatientsRoutingModule, routedComponents} from './patients-routing.module';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {PatientAntecedentComponent} from './patient-view/patient-antecedent/patient-antecedent.component';
import {PatientService} from '../../@core/services/patient.service';
import {ToasterModule} from 'angular2-toaster';
import {PendingChangesGuard} from '../../@core/utils/pending-changes.guard';
import {GroupByPipe} from '../../@core/pipes/group-by.directive';
import {AgePipe} from '../../@core/pipes/age.directive';
import {MiscellaneousModule} from '../miscellaneous/miscellaneous.module';

@NgModule({
  imports: [
    ThemeModule,
    PatientsRoutingModule,
    BsDatepickerModule.forRoot(),
    ToasterModule.forRoot(),
    MiscellaneousModule,
  ],
  declarations: [
    ...routedComponents,
    PatientAntecedentComponent,
    GroupByPipe,
    AgePipe,
  ],
  entryComponents: [
  ],
  providers: [
    PatientService,
    PendingChangesGuard,
  ],
})
export class PatientsModule { }
