import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-modal-confirm',
  templateUrl: 'modal-confirm.component.html',
})
export class ModalConfirmComponent {

  confirmationLabel: string;
  modalHeader: string;
  modalContent: string;

  constructor(private activeModal: NgbActiveModal) {
  }

  closeModal() {
    this.activeModal.close(false);
  }

  public onModalConfirmed(): void {
    this.activeModal.close(true);
  }
}
