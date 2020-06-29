import {NgModule} from '@angular/core';

import {ThemeModule} from '../../@theme/theme.module';
import {OfficesRoutingModule, routedComponents} from './offices-routing.module';
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
  NbUserModule,
} from '@nebular/theme';
import {FormsModule} from '@angular/forms';
import {OfficesViewDetailsComponent} from './offices-view/offices-view-details/offices-view-details.component';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {OfficeService} from '../../@core/services/office.service';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {MiscellaneousModule} from '../miscellaneous/miscellaneous.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {CKEditorModule} from 'ng2-ckeditor';
import {KeycloakBearerInterceptor} from 'keycloak-angular';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
  imports: [
    ThemeModule,
    OfficesRoutingModule,
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
    NbAccordionModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
  ],
})
export class OfficesModule {
}
