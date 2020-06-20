import {Component, OnInit} from '@angular/core';
import {PaymentType} from '../../../patients/patient.model';
import {User} from '../../../../@core/data/users';

@Component({
  selector: 'ngx-offices-view-details',
  styleUrls: ['./offices-view-details.component.scss'],
  templateUrl: './offices-view-details.component.html',
})
export class OfficesViewDetailsComponent implements OnInit {
  paymentTypes = PaymentType;
  practitioners: User[] = [{
    name: 'Ingrid Lhotellier',
    picture: '',
  }];

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
}
