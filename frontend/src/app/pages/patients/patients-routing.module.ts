import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientsComponent } from './patients.component';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientNewComponent} from './patient-new/patient-new.component';
import {PatientViewComponent} from './patient-view/patient-view.component';

const routes: Routes = [{
  path: '',
  component: PatientsComponent,
  children: [{
    path: 'list',
    component: PatientsListComponent,
  }, {
    path: 'new',
    component: PatientNewComponent,
  }, {
    path: ':id',
    component: PatientViewComponent,
  }],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class PatientsRoutingModule {

}

export const routedComponents = [
  PatientsComponent,
  PatientsListComponent,
  PatientNewComponent,
  PatientViewComponent,
];
