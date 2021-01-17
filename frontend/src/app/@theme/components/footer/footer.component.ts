import {Component} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by <b>Max</b> 2021
    </span>
    <div class="pull-right">
      Version : {{ version }} ( {{ date | date:'medium' }} )
    </div>
  `,
})
export class FooterComponent {
  version: string;
  date: Date;

  constructor() {
    this.version = environment.version;
    if (environment.buildDate) {
      this.date = new Date(environment.buildDate);
    } else {
      this.date = new Date();
    }
  }
}
