import { Component } from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created with ♥ by <b>
      <a href="https://github.com/akraxx" target="_blank">Max</a></b> 2020</span>
    <div class="pull-right">
      Version : {{ version }} ( {{ date | date:'medium' }} )
    </div>
  `,
})
export class FooterComponent {
  version: string = environment.version;
  date: Date = environment.buildDate;
}
