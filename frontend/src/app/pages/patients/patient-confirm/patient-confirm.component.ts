import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-modal-patient-confirm',
  templateUrl: 'patient-confirm.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PatientConfirmComponent {

  confirmationLabel: string;
  modalHeader: string;
  modalContent: string;
  btnStatus: string = 'danger';

  constructor(private activeModal: NgbActiveModal) {
  }

  closeModal() {
    this.activeModal.close(false);
  }

  public onModalConfirmed(): void {
    this.activeModal.close(true);
  }
}
