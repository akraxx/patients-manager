import {Component, OnInit} from '@angular/core';
import {Patient, Sexe} from '../patient.model';
import {PatientService} from '../../../@core/services/patient.service';
import {BsLocaleService} from 'ngx-bootstrap';
import {ToasterConfig, ToasterService} from 'angular2-toaster';

import 'style-loader!angular2-toaster/toaster.css';
import {Router} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'ngx-patient-new',
  styleUrls: ['./patient-new.component.scss'],
  templateUrl: './patient-new.component.html',
})
export class PatientNewComponent implements OnInit {
  sexe = Sexe;
  patient: Patient = new Patient();
  config: ToasterConfig;
  loggedUser: string = 'unknown';

  constructor(private patientService: PatientService,
              private localeService: BsLocaleService,
              private toasterService: ToasterService,
              private keycloakService: KeycloakService,
              private router: Router) {
    this.localeService.use('fr');
  }

  savePatient() {
    this.patient.createdBy = this.loggedUser;
    this.patient.updatedBy = this.loggedUser;
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

  ngOnInit(): void {
    this.keycloakService.isLoggedIn()
      .then(result => {
        if (result) {
          this.loggedUser = this.keycloakService.getUsername();
        }
      });
  }
}
