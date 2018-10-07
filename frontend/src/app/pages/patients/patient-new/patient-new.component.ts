import {Component} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AntecedentModalComponent} from "./antecedent-modal/antecedent-modal.component";

@Component({
  selector: 'ngx-patient-new',
  styleUrls: ['./patient-new.component.scss'],
  templateUrl: './patient-new.component.html',
})
export class PatientNewComponent {
  model;

  constructor() { }


}
