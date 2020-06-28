import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PatientsComponent} from './patients.component';
import {PatientsListComponent} from './patients-list/patients-list.component';
import {PatientNewComponent} from './patient-new/patient-new.component';
import {PatientViewComponent} from './patient-view/patient-view.component';
import {PendingChangesGuard} from '../../@core/utils/pending-changes.guard';
import {NotFoundComponent} from '../miscellaneous/not-found/not-found.component';

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
    canDeactivate: [PendingChangesGuard],
  }, {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
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
