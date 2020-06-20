import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbMenuService, NbSidebarService} from '@nebular/theme';
import {LayoutService} from '../../../@core/utils';
import {Subject} from 'rxjs';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  userMenu = [{ title: 'Se déconnecter' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private layoutService: LayoutService,
              private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    this.user = this.keycloakService.getUsername();

    this.menuService.onItemClick().subscribe(( event ) => {
      this.onItemSelection(event.item.title);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onItemSelection( title ) {
    if ( title === 'Se déconnecter') {
      // Do something on Log out
      this.keycloakService.logout('https://ingridlhotellier.fr');
    }
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
