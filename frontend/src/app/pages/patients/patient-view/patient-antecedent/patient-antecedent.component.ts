import {Component, Input} from '@angular/core';

export class Antecedent {
  title: string;
  important: boolean;
  value: string;
}

export class AntecedentCategory {
  title: string;
  antecedents: Antecedent[];
}

@Component({
  selector: 'ngx-patient-antecedent',
  styleUrls: ['./patient-antecedent.component.scss'],
  templateUrl: './patient-antecedent.component.html',
})
export class PatientAntecedentComponent {

  @Input() antecedent: Antecedent;

  showInput = false;
  constructor() { }

  removeAntecedent() {
    this.antecedent.value = '';
    this.antecedent.important = false;
    this.showInput = false;
  }

}
