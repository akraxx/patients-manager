import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsLocaleService} from 'ngx-bootstrap';
import {Antecedent} from './patient-antecedent/patient-antecedent.component';
import {HandOrientation, MaritalStatus, Patient, Sexe} from '../patient.model';
import {PatientService} from '../../../@core/services/patient.service';
import {Observable, Subject} from 'rxjs/Rx';
import {ComponentCanDeactivate} from '../../../@core/utils/pending-changes.guard';
import 'style-loader!angular2-toaster/toaster.css';
import {ToasterService} from 'angular2-toaster';

@Component({
  selector: 'ngx-patient-view',
  styleUrls: ['./patient-view.component.scss'],
  templateUrl: './patient-view.component.html',
})
export class PatientViewComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  id: string;

  @ViewChild('patientForm') patientForm: ElementRef;
  patient: Patient = new Patient();
  sexe = Sexe;
  handOrientation = HandOrientation;
  maritalStatuses = MaritalStatus;
  private sub: any;

  templateAntecedents: Antecedent[];

  patientUpdate = new Subject<Patient>();
  patientSaved = true;
  patientSaving = false;

  constructor(private route: ActivatedRoute,
              private localeService: BsLocaleService,
              private patientService: PatientService,
              private toasterService: ToasterService) {
    this.localeService.use('fr');

    this.templateAntecedents = [
      {
        title: 'Médecine',
        category: 'Actuellement',
        important: false,
        value: '',
      },
      {
        title: 'Psychologie',
        category: 'Actuellement',
        important: false,
        value: '',
      },
      {
        title: 'Traitement médical',
        category: 'Actuellement',
        important: false,
        value: '',
      },
      {
        title: 'Décès',
        category: 'Antécédents familiaux',
        important: false,
        value: '',
      },
      {
        title: 'Accouchements',
        category: 'Antécédents familiaux',
        important: false,
        value: '',
      },
      {
        title: 'Autre',
        category: 'Antécédents familiaux',
        important: false,
        value: '',
      },
      {
        title: 'Entorse',
        category: 'Antécédents traumas',
        important: false,
        value: '',
      },
      {
        title: 'Fracture',
        category: 'Antécédents traumas',
        important: false,
        value: '',
      },
      {
        title: 'Luxation',
        category: 'Antécédents traumas',
        important: false,
        value: '',
      },
      {
        title: 'Accident voiture',
        category: 'Antécédents traumas',
        important: false,
        value: '',
      },
      {
        title: 'AVP',
        category: 'Antécédents traumas',
        important: false,
        value: '',
      },
      {
        title: 'Chutes',
        category: 'Antécédents traumas',
        important: false,
        value: '',
      },
      {
        title: 'Autres',
        category: 'Antécédents traumas',
        important: false,
        value: '',
      },
      {
        title: 'Orthopédique',
        category: 'Antécédents chirurgicaux',
        important: false,
        value: '',
      },
      {
        title: 'Tete',
        category: 'Antécédents chirurgicaux',
        important: false,
        value: '',
      },
      {
        title: 'Thorax',
        category: 'Antécédents chirurgicaux',
        important: false,
        value: '',
      },
      {
        title: 'Abdomen',
        category: 'Antécédents chirurgicaux',
        important: false,
        value: '',
      },
      {
        title: 'Gynéco/uro',
        category: 'Antécédents chirurgicaux',
        important: false,
        value: '',
      },
      {
        title: 'ORL',
        category: 'Antécédents chirurgicaux',
        important: false,
        value: '',
      },
    ];
  }

  patientChanged() {
    this.patientSaved = false;
    this.patientUpdate.next(this.patient);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number
      this.patientService.getPatientById(this.id)
        .subscribe(
          result => {
            // Handle result
            this.patient = result;
            this.templateAntecedents
              .forEach(antecedent => {
                if (this.patient.antecedents
                    .find(existingAntecedent => existingAntecedent.title === antecedent.title) === undefined) {
                  this.patient.antecedents.push(antecedent);
                }
              });
          },
          error => {
            this.toasterService.pop('error', 'Impossible de récupérer le patient.', error.error.message);
          },
        );
      // In a real app: dispatch action to load the details here.
    });

    // Automatically save every 5 seconds if there are some changes
    this.patientUpdate
      .debounceTime(5000)
      .subscribe((patient: Patient) => {
        this.savePatient(patient);
      });
  }

  savePatient(patient: Patient) {
    this.patientSaving = true;
    this.patientService.updatePatient(this.id, patient)
      .finally(() => this.patientSaving = false)
      .subscribe(
        () => {
          this.patientSaved = true;
        },
        error => {
          this.toasterService.pop('error', 'Impossible de sauvegarder le patient.', error.error.message);
        },
      );
  }

  antecedentChanged(antecedent: Antecedent) {
    this.patientChanged();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:beforeunload', ['$event'])
  yourfunction($event) {
    if (!this.canDeactivate()) {
      $event.returnValue = 'Des changements n\'ont pas été sauvegardés, êtes vous sûr de vouloir quitter la page?';
    }
  }

  canDeactivate(): (boolean | Observable<boolean>) {
    return this.patientSaved;
  }

  getNumberOfAntecedents() {
    let numberOfFilledAntecedents = 0;
    if (this.patient && this.patient.antecedents) {
      this.patient.antecedents.forEach(antecedent => {
        if (antecedent.value !== '') {
          numberOfFilledAntecedents++;
        }
      });
    }

    return numberOfFilledAntecedents + '';
  }

  getAge() {
    if (this.patient.birthDate) {
      const timeDiff = Math.abs(Date.now() - new Date(this.patient.birthDate).getTime());
      // Used Math.floor instead of Math.ceil
      // so 26 years and 140 days would be considered as 26, not 27.
      return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
      return '';
    }
  }

}
