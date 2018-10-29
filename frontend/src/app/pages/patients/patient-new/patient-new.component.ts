import {Component} from '@angular/core';
import {Patient, Sexe} from '../patient.model';
import {PatientService} from '../../../@core/services/patient.service';
import {BsLocaleService} from 'ngx-bootstrap';
import {ToasterConfig, ToasterService} from 'angular2-toaster';

import 'style-loader!angular2-toaster/toaster.css';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-patient-new',
  styleUrls: ['./patient-new.component.scss'],
  templateUrl: './patient-new.component.html',
})
export class PatientNewComponent {
  sexe = Sexe;
  patient: Patient = new Patient();
  config: ToasterConfig;

  constructor(private patientService: PatientService,
              private localeService: BsLocaleService,
              private toasterService: ToasterService,
              private router: Router) {
    this.localeService.use('fr');
  }

  savePatient() {
    this.patientService.addPatient(this.patient)
      .subscribe(
        result => {
          // Handle result
          this.toasterService.pop('success', result.firstName + ' '
            + result.lastName + ' a été enregistré.');
          this.router.navigate(['/pages/patients/' + result._id]);
        },
        error => {
          this.toasterService.pop('error', 'Impossible d\'enregistrer le patient.');
        },
      );
  }

  resetForm() {
    this.patient = new Patient();
  }
}
