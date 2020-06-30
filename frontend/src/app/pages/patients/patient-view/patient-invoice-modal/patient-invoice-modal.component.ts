import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PatientService} from '../../../../@core/services/patient.service';
import {Patient} from '../../../../../../../common/patient.model';
import {DatePipe} from '@angular/common';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {NbToastrService} from '@nebular/theme';
import {Consultation} from '../../../../../../../common/consultation.model';
import {PaymentType} from '../../../../../../../common/payment.model';

@Component({
  selector: 'ngx-patient-invoice-modal',
  styleUrls: ['./patient-invoice-modal.component.scss'],
  templateUrl: 'patient-invoice-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [PatientService, BsLocaleService],
})
export class PatientInvoiceModalComponent {

  confirmationLabel: string;
  modalHeader: string;
  modalContent: string;
  patient: Patient;
  consultation: Consultation;
  processingInvoice = false;
  badFields: number = 0;
  mandatoryFields: Map<string, boolean> = new Map<string, boolean>();
  optionalFields: Map<string, boolean> = new Map<string, boolean>();

  constructor(private activeModal: NgbActiveModal,
              private patientService: PatientService,
              private toasterService: NbToastrService,
              private localeService: BsLocaleService,
              private datepipe: DatePipe) {
    this.localeService.use('fr');
  }

  closeModal() {
    this.activeModal.close(false);
  }

  public init(patient: Patient, consultation: Consultation) {
    // mandatory fields
    this.mandatoryFields.set('sexe', this.isValidField(patient.sexe));
    this.mandatoryFields.set('lastName', this.isValidField(patient.lastName));
    this.mandatoryFields.set('firstName', this.isValidField(patient.firstName));
    this.mandatoryFields.set('birthDate', this.isValidField(patient.birthDate));
    this.mandatoryFields.set('paymentType', this.isValidField(consultation.paymentType, 'None'));
    this.mandatoryFields.set('date', this.isValidField(consultation.date));
    this.mandatoryFields.set('office', this.isValidField(consultation.office));

    // optional fields
    this.optionalFields.set('address', this.isValidField(patient.address));
    this.optionalFields.set('zipCode', this.isValidField(patient.zipCode));
    this.optionalFields.set('city', this.isValidField(patient.city));
    this.optionalFields.set('socialSecurityNumber', this.isValidField(patient.socialSecurityNumber));

    this.patient = patient;
    this.consultation = consultation;
  }

  // Check if given field is not empty or undefined and does not match given value (optional)
  public isValidField(field: any, notMatching?: string): boolean {
    return field && field !== notMatching;
  }

  public getFieldClass(field: any, mandatory: boolean): string {
    if (mandatory && !this.mandatoryFields.get(field)) {
      return 'fa fa-times-circle text-danger';
    } else if (!mandatory && !this.optionalFields.get(field)) {
      return 'fa fa-exclamation-circle text-warning';
    } else {
      return 'fa fa-check-circle text-success';
    }
  }

  public hasMissingMandatoryFields(): boolean {
    return Array.from(this.mandatoryFields.values()).filter(b => b === false).length > 0;
  }

  public getPaymentTypeLabel(paymentType: string): string {
    return PaymentType[paymentType];
  }

  public sendInvoice(): void {
    this.processingInvoice = true;
    this.patientService.sendInvoice(this.patient._id, this.consultation.id)
      .finally(() => this.processingInvoice = false)
      .subscribe(
        () => this.toasterService.success('La facture a été envoyée par mail au patient'),
        error => {
          this.toasterService.danger(error.error.message, 'Impossible d\'envoyer la facture.');
        },
      );
  }

  public downloadInvoice(): void {
    this.processingInvoice = true;
    this.patientService.downloadInvoice(this.patient._id, this.consultation.id)
      .finally(() => this.processingInvoice = false)
      .subscribe(
        x => {
          const newBlob = new Blob([x], {type: 'application/pdf'});

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
          }

          // For other browsers:
          // Create a link pointing to the ObjectURL containing the blob.
          const data = window.URL.createObjectURL(newBlob);

          const link = document.createElement('a');
          link.href = data;
          link.download = Consultation.invoiceFileName(this.consultation, this.patient);

          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

          setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);

          this.toasterService.success('La facture a été générée et téléchargée');

        },
        error => {
          this.toasterService.danger(error.error.message, 'Impossible de télécharger la facture.');
        },
      );
  }
}
