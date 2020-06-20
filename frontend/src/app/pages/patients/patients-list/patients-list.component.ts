import {Component, OnInit} from '@angular/core';
import {PatientService} from '../../../@core/services/patient.service';
import {Patient} from '../patient.model';
import {Observable} from 'rxjs/Rx';
import {NbTabComponent} from '@nebular/theme/components/tabset/tabset.component';
import {KeycloakService} from 'keycloak-angular';
import {NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-patients-list',
  styleUrls: ['./patients-list.component.scss'],
  templateUrl: './patients-list.component.html',
})
export class PatientsListComponent implements OnInit {
  patientSearch: string;
  patients: Patient[];
  page: number = 1;
  loggedUser: string = 'unknown';

  constructor(private patientService: PatientService,
              private toasterService: NbToastrService,
              private keycloakService: KeycloakService) {
  }

  searchPatients() {
    this.processPatients(this.patientService.getPatients());
  }

  searchPatientsByName(name: string) {
    this.processPatients(this.patientService.searchPatientByName(name));
  }

  processPatients(patientsObservable: Observable<Patient[]>) {
    patientsObservable.subscribe((patients) => {
        this.patients = patients;
      },
      error => {
        this.toasterService.danger('Impossible de chercher les patients avec le nom ' + name,
          error.error.message);
      });
  }

  tabChanged(tab: NbTabComponent) {
    if (tab.tabTitle === 'Tous') {
      this.processPatients(this.patientService.getPatients('lastName', 'asc'));
    } else if (tab.tabTitle === 'Derniers enregistrés') {
      this.processPatients(this.patientService.getPatients('createdAt', 'desc'));
    } else if (tab.tabTitle === 'Mes patients') {
      this.processPatients(this.patientService.searchPatientByOsteopath(this.loggedUser));
    } else {
      this.patients = [];
    }
  }

  getLastConsultationDate(patient: Patient): Date {
    if (!patient.consultations || patient.consultations.length === 0) {
      return null;
    } else {
      return new Date(patient.consultations[0].date);
    }
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
