import {Component, Input, OnInit} from '@angular/core';

import {NbMenuService, NbSidebarService} from '@nebular/theme';
import {LayoutService} from '../../../@core/data/layout.service';
import {KeycloakService} from 'keycloak-angular';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any;

  userMenu = [{ title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private keycloakService: KeycloakService,
              private layoutService: LayoutService,
              private router: Router) {
  }

  ngOnInit() {
    this.user = this.keycloakService.getUsername();

    this.menuService.onItemClick().subscribe(( event ) => {
      this.onItemSelection(event.item.title);
    });
  }

  onItemSelection( title ) {
    if ( title === 'Log out' ) {
      // Do something on Log out
      this.keycloakService.logout('https://ingridlhotellier.fr');
    }
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.router.navigate(['/pages/patients/list']);
  }

  newPatient() {
    this.router.navigate(['/pages/patients/new']);
  }
}
