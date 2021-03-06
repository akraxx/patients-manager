import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Antecedent} from '../../../../../../../common/antecedent.model';

@Component({
  selector: 'ngx-patient-antecedent',
  styleUrls: ['./patient-antecedent.component.scss'],
  templateUrl: './patient-antecedent.component.html',
})
export class PatientAntecedentComponent implements OnInit {

  @Input() antecedent: Antecedent;
  @Output() changed = new EventEmitter();

  showInput = false;
  constructor() { }

  removeAntecedent() {
    this.antecedent.value = '';
    this.antecedent.important = false;
    this.showInput = false;
    this.changed.emit();
  }

  antecedentChanged() {
    this.changed.emit();
  }

  ngOnInit(): void {
    if (this.antecedent.value) {
      this.showInput = true;
    }
  }

}
