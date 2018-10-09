import {NgModule} from '@angular/core';

import {ThemeModule} from '../../@theme/theme.module';
import {PatientsRoutingModule, routedComponents} from './patients-routing.module';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {PatientAntecedentComponent} from './patient-view/patient-antecedent/patient-antecedent.component';

@NgModule({
  imports: [
    ThemeModule,
    PatientsRoutingModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    ...routedComponents,
    PatientAntecedentComponent
  ],
  entryComponents: [
  ],
})
export class PatientsModule { }
