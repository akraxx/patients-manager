import {NgModule} from '@angular/core';

import {ThemeModule} from '../../@theme/theme.module';
import {OfficesRoutingModule, routedComponents} from './offices-routing.module';
import {PendingChangesGuard} from '../../@core/utils/pending-changes.guard';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbSelectModule,
  NbTabsetModule,
  NbUserModule,
} from '@nebular/theme';
import {FormsModule} from '@angular/forms';
import {OfficesViewDetailsComponent} from './offices-view/offices-view-details/offices-view-details.component';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {OfficeService} from '../../@core/services/office.service';

@NgModule({
  imports: [
    ThemeModule,
    OfficesRoutingModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    FormsModule,
    NbFormFieldModule,
    NbInputModule,
    NbTabsetModule,
    NbCheckboxModule,
    NbUserModule,
    NbListModule,
    NbSelectModule,
    AngularFileUploaderModule,
  ],
  declarations: [
    ...routedComponents,
    OfficesViewDetailsComponent,
  ],
  entryComponents: [
  ],
  providers: [
    OfficeService,
    PendingChangesGuard,
  ],
})
export class OfficesModule {
}
