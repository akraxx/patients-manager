import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {HandOrientation, MaritalStatus, Patient, Sexe} from '../../../../../../common/patient.model';
import {PatientService} from '../../../@core/services/patient.service';
import {Observable, Subject} from 'rxjs/Rx';
import {ComponentCanDeactivate} from '../../../@core/utils/pending-changes.guard';
import '../../editors/ckeditor/ckeditor.loader';
import 'ckeditor';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PatientConfirmComponent} from '../patient-confirm/patient-confirm.component';
import {KeycloakService} from 'keycloak-angular';
import {PatientInvoiceModalComponent} from './patient-invoice-modal/patient-invoice-modal.component';
import {NbToastrService} from '@nebular/theme';
import {PaymentType} from '../../../../../../common/payment.model';
import {Antecedent, DEFAULT_ANTECEDENTS} from '../../../../../../common/antecedent.model';
import {Consultation} from '../../../../../../common/consultation.model';
import {OfficeService} from '../../../@core/services/office.service';
import {Office} from '../../../../../../common/office.model';


@Component({
  selector: 'ngx-patient-view',
  styleUrls: ['./patient-view.component.scss'],
  templateUrl: './patient-view.component.html',
})
export class PatientViewComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  id: string;
  @ViewChild('patientForm') patientForm: ElementRef;
  patient: Patient;
  offices: Office[];
  sexe = Sexe;
  handOrientation = HandOrientation;
  maritalStatuses = MaritalStatus;
  paymentTypes = PaymentType;
  loggedUser: string = 'unknown';

  private sub: any;

  templateAntecedents: Antecedent[];

  patientUpdate = new Subject<Patient>();
  patientSaved = true;
  patientSaving = false;

  timestamp = new Date().getUTCMilliseconds();

  constructor(private route: ActivatedRoute,
              private localeService: BsLocaleService,
              private patientService: PatientService,
              private officeService: OfficeService,
              private toasterService: NbToastrService,
              private modalService: NgbModal,
              private keycloakService: KeycloakService) {
    this.localeService.use('fr');

    this.templateAntecedents = DEFAULT_ANTECEDENTS;
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
            this.patient.birthDate = new Date(this.patient.birthDate);

            if (!this.patient.consultations) {
              this.patient.consultations = [];
            }
            this.patient.consultations
              .forEach(consultation => {
                consultation.date = new Date(consultation.date);
                consultation.isOpen = false;
                if (!consultation.office) {
                  consultation.office = this.offices[0];
                }
              });
          },
          error => {
            this.toasterService.danger('Impossible de récupérer le patient.', error.error.message);
          },
        );
      // In a real app: dispatch action to load the details here.
    });

    this.officeService.getOffices()
      .subscribe(
        result => this.offices = result,
        error => this.toasterService.danger(error.error.message, 'Impossible de récupérer les cabinets.'),
      );
    // Automatically save every 5 seconds if there are some changes
    this.patientUpdate
      .debounceTime(5000)
      .subscribe((patient: Patient) => {
        patient.updatedBy = this.loggedUser;
        this.savePatient(patient);
      });

    this.keycloakService.isLoggedIn()
      .then(result => {
        if (result) {
          this.loggedUser = this.keycloakService.getUsername();
        }
      });
  }

  savePatient(patient: Patient) {
    this.patientSaving = true;
    this.patientService.updatePatient(this.id, patient)
      .finally(() => this.patientSaving = false)
      .subscribe(
        p => {
          this.patient.updatedAt = p.updatedAt;
          this.patientSaved = true;
        },
        error => {
          this.toasterService.danger(error.error.message, 'Impossible de sauvegarder le patient.');
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

  getConsultationPaymentClass(consultation: Consultation) {
    let color: string = 'text-danger';
    let icon: string = 'fa-times';
    if (consultation.paymentType === 'Check') {
      icon = 'fa-money-check';
      if (consultation.clearedCheck) {
        color = 'text-success';
      } else {
        color = 'text-warning';
      }
    } else if (consultation.paymentType === 'Cash') {
      icon = 'fa-money-bill';
      color = 'text-success';
    }

    return `${color} ${icon}`;
  }

  newConsultation() {
    const consultation = new Consultation();
    consultation.id = this.patient.consultations.length;
    consultation.osteopath = this.loggedUser;
    consultation.isOpen = true;
    consultation.office = this.offices[0];
    consultation.price = consultation.office.price;
    this.patient.consultations.unshift(consultation);
  }

  removeConsultation(consultation: Consultation) {
    const modal = this.modalService.open(PatientConfirmComponent, {size: 'lg', container: 'nb-layout'});
    modal.componentInstance.modalHeader = 'Supprimer la consultation';
    modal.componentInstance.modalContent = `
      Êtes vous sur de vouloir supprimer la consultation effectuée sur
      ${this.patient.firstName} ${this.patient.lastName} à la date du ${consultation.date} ?
    `;
    modal.componentInstance.confirmationLabel = 'Supprimer';

    modal.result.then(result => {
      if (result) {
        this.patient.consultations.splice(this.patient.consultations.indexOf(consultation), 1);
        this.patientChanged();
      }
    });
  }

  downloadInvoice(consultation: Consultation) {
    this.savePatient(this.patient);

    const modal = this.modalService.open(PatientInvoiceModalComponent, {size: 'lg', container: 'nb-layout'});

    modal.componentInstance.init(this.patient, consultation);
  }

  officeChanged(consultation: Consultation, event: string) {
    const office = this.offices.find((o: Office) => event === o._id);
    consultation.office = office;
    consultation.price = office.price;
    this.patientChanged();
  }
}
