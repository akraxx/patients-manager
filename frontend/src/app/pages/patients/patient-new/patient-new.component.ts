import {Component, OnInit} from '@angular/core';
import {PatientService} from '../../../@core/services/patient.service';

import {Router} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {NbDateService, NbToastrService} from '@nebular/theme';
import {Patient, Sexe} from '../../../../../../common/patient.model';

@Component({
  selector: 'ngx-patient-new',
  styleUrls: ['./patient-new.component.scss'],
  templateUrl: './patient-new.component.html',
})
export class PatientNewComponent implements OnInit {
  sexe = Sexe;
  patient: Patient;
  creating: boolean;
  loggedUser: string = 'unknown';
  max: Date;

  constructor(private patientService: PatientService,
              private localeService: BsLocaleService,
              private toasterService: NbToastrService,
              private keycloakService: KeycloakService,
              protected dateService: NbDateService<Date>,
              private router: Router) {
    this.localeService.use('fr');
    this.max = this.dateService.today();
  }

  savePatient() {
    this.patient.createdBy = this.loggedUser;
    this.patient.updatedBy = this.loggedUser;
    this.creating = true;
    this.patientService.addPatient(this.patient)
      .finally(() => this.creating = false)
      .subscribe(
        result => {
          // Handle result
          this.toasterService.success(result.firstName + ' '
            + result.lastName + ' a été enregistré.');
          this.router.navigate(['/pages/patients/' + result._id]);
        },
        error => {
          this.toasterService.danger('Impossible d\'enregistrer le patient.');
        },
      );
  }

  resetForm() {
    this.patient = new Patient();
  }

  ngOnInit(): void {
    this.resetForm();
    this.keycloakService.isLoggedIn()
      .then(result => {
        if (result) {
          this.loggedUser = this.keycloakService.getUsername();
        }
      });
  }
}
