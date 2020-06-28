import {Component, Input, OnInit} from '@angular/core';
import {PaymentType} from '../../../../../../../common/payment.model';
import {Office, OfficeMember, OfficeRole} from '../../../../../../../common/office.model';

@Component({
  selector: 'ngx-offices-view-details',
  styleUrls: ['./offices-view-details.component.scss'],
  templateUrl: './offices-view-details.component.html',
})
export class OfficesViewDetailsComponent implements OnInit {
  @Input()
  office: Office;

  paymentTypes = PaymentType;
  officeRoles = OfficeRole;

  afuConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png',
    maxSize: '2',
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    uploadAPI: {
      url: 'https://example-file-upload-api',
    },
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  public isPaymentAvailable(key: string): boolean {
    return this.office.paymentTypes.indexOf(PaymentType[key]) >= 0;
  }
}
