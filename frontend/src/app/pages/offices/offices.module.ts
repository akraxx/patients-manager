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
  NbListModule,
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
import {OfficesViewStatsComponent} from './offices-view/offices-view-stats/offices-view-stats.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartModule} from 'angular2-chartjs';
import {ComparisonBarComponent} from './offices-view/offices-view-stats/comparison-bar/comparison-bar.component';
import {SalesOfficeViewStatsComponent} from './offices-view/offices-view-stats/sales-offices-view-stats.component';
import {
  ConsultationsOfficesViewStatsComponent,
} from './offices-view/offices-view-stats/consultations-offices-view-stats.component';
import {StatisticService} from '../../@core/services/statistic.service';

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
    NgxChartsModule,
    ChartModule,
    NbListModule,
  ],
  declarations: [
    ...routedComponents,
    OfficesViewDetailsComponent,
    OfficesViewStatsComponent,
    SalesOfficeViewStatsComponent,
    ConsultationsOfficesViewStatsComponent,
    ComparisonBarComponent,
  ],
  entryComponents: [],
  providers: [
    OfficeService,
    StatisticService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
  ],
})
export class OfficesModule {
}
