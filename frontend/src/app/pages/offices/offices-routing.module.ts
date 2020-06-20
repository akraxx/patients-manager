import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from '../miscellaneous/not-found/not-found.component';
import {OfficesComponent} from './offices.component';
import {OfficesListComponent} from './offices-list/office-list.component';
import {OfficesNewComponent} from './offices-new/offices-new.component';
import {OfficesViewComponent} from './offices-view/offices-view.component';

const routes: Routes = [{
  path: '',
  component: OfficesComponent,
  children: [{
    path: 'list',
    component: OfficesListComponent,
  }, {
    path: 'new',
    component: OfficesNewComponent,
  }, {
    path: ':id',
    component: OfficesViewComponent,
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
export class OfficesRoutingModule {

}

export const routedComponents = [
  OfficesComponent,
  OfficesListComponent,
  OfficesNewComponent,
  OfficesViewComponent,
];
