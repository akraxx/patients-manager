import {Component, OnInit} from '@angular/core';
import {PatientService} from '../../../@core/services/patient.service';
import {Observable} from 'rxjs/Rx';
import {NbTabComponent} from '@nebular/theme/components/tabset/tabset.component';
import {KeycloakService} from 'keycloak-angular';
import {NbToastrService} from '@nebular/theme';
import {Patient, PatientResultSet} from '../../../../../../common/patient.model';

@Component({
  selector: 'ngx-patients-list',
  styleUrls: ['./patients-list.component.scss'],
  templateUrl: './patients-list.component.html',
})
export class PatientsListComponent implements OnInit {
  patientSearch: string;
  patients: Patient[];
  total: number = 0;
  page: number = 1;
  loggedUser: string = 'unknown';
  activeTab: NbTabComponent;
  searchValue: string;

  constructor(private patientService: PatientService,
              private toasterService: NbToastrService,
              private keycloakService: KeycloakService) {
  }

  searchPatientsByName(value: string) {
    this.searchValue = value;
    this.updatePatients();
  }

  processPatients(patientsObservable: Observable<PatientResultSet>) {
    patientsObservable.subscribe((r) => {
        this.patients = r.patients;
        this.total = r.total;
      },
      error => {
        this.toasterService.danger('Impossible de chercher les patients avec le nom ' + name,
          error.error.message);
      });
  }

  tabChanged(tab: NbTabComponent) {
    this.activeTab = tab;
    this.page = 1;
    this.updatePatients();
  }

  updatePatients() {
    if (this.activeTab.tabTitle === 'Tous') {
      this.processPatients(this.patientService.getPatients('lastName', 'asc', 10, (this.page - 1) * 10));
    } else if (this.activeTab.tabTitle === 'Derniers enregistrés') {
      this.processPatients(this.patientService.getPatients('createdAt', 'desc', 10, (this.page - 1) * 10));
    } else if (this.activeTab.tabTitle === 'Mes patients') {
      this.processPatients(this.patientService.searchPatientByOsteopath(this.loggedUser, 10, (this.page - 1) * 10));
    } else {
      this.processPatients(this.patientService.searchPatientByName(this.searchValue));
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

  getPage(page: number) {
    this.page = page;
    this.updatePatients();
  }

}
