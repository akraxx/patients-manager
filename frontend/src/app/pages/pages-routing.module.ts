import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {NotFoundComponent} from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'patients',
      loadChildren: () => import('./patients/patients.module')
        .then(m => m.PatientsModule),
    },
    {
      path: 'offices',
      loadChildren: () => import('./offices/offices.module')
        .then(m => m.OfficesModule),
    },
    {
      path: '',
      redirectTo: 'patients',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

