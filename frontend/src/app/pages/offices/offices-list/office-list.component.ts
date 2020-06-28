import {Component, OnInit} from '@angular/core';
import {OfficeService} from '../../../@core/services/office.service';
import {Office} from '../../../../../../common/office.model';
import {NbToastrService} from '@nebular/theme';
import {PaymentType} from '../../../../../../common/payment.model';

@Component({
  selector: 'ngx-offices-list',
  styleUrls: ['./offices-list.component.scss'],
  templateUrl: './offices-list.component.html',
})
export class OfficesListComponent implements OnInit {
  offices: Office[];

  constructor(private officeService: OfficeService,
              private toasterService: NbToastrService) {
  }

  public paymentTypeLabels(paymentTypes: string[]): string {
    return paymentTypes.map(p => PaymentType[p].toString()).join(', ');
  }

  ngOnInit(): void {
    this.officeService.getOffices()
      .subscribe(r => this.offices = r,
        error => {
          this.toasterService.danger(error.error.message, 'Impossible de récupérer les cabinets.');
        },
      );
  }
}
