import {Component} from '@angular/core';
import {PatientService} from '../../../@core/services/patient.service';
import {ToasterService} from 'angular2-toaster';
import {Patient} from '../patient.model';
import {Observable} from 'rxjs/Rx';
import {NbTabComponent} from '@nebular/theme/components/tabset/tabset.component';

@Component({
  selector: 'ngx-patients-list',
  styleUrls: ['./patients-list.component.scss'],
  templateUrl: './patients-list.component.html',
})
export class PatientsListComponent {
  patientSearch: string;
  patients: Patient[];
  page: number = 1;

  constructor(private patientService: PatientService,
              private toasterService: ToasterService) {
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
        this.toasterService.pop('error',
          'Impossible de chercher les patients avec le nom ' + name,
          error.error.message);
      });
  }

  tabChanged(tab: NbTabComponent) {
    if (tab.tabTitle === 'Tous') {
      this.processPatients(this.patientService.getPatients('lastName', 'asc'));
    } else if (tab.tabTitle === 'Derniers enregistrés') {
      this.processPatients(this.patientService.getPatients('createdAt', 'desc'));
    } else {
      this.patients = [];
    }
  }

}
