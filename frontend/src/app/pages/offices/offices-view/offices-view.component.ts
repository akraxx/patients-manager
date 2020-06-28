import {Component, OnDestroy, OnInit} from '@angular/core';
import {OfficeService} from '../../../@core/services/office.service';
import {ActivatedRoute} from '@angular/router';
import {NbToastrService} from '@nebular/theme';
import { Office } from '../../../../../../common/office.model';

@Component({
  selector: 'ngx-offices-view',
  styleUrls: ['./offices-view.component.scss'],
  templateUrl: './offices-view.component.html',
})
export class OfficesViewComponent implements OnInit, OnDestroy {
  id: string;
  office: Office;
  private sub: any;

  constructor(private route: ActivatedRoute,
              private toasterService: NbToastrService,
              private officeService: OfficeService) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number
      this.officeService.getOfficeById(this.id)
        .subscribe(
          result => this.office = result,
          error => {
            this.toasterService.danger(error.error.message, 'Impossible de récupérer le cabinet.');
          },
        );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
