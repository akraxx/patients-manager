import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {LayoutService} from '../../../@core/utils';
import {Subject} from 'rxjs';
import {KeycloakService} from 'keycloak-angular';
import {map, takeUntil} from 'rxjs/operators';

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
              private keycloakService: KeycloakService,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService) {
  }

  ngOnInit() {
    this.user = this.keycloakService.getUsername();

    this.menuService.onItemClick().subscribe(( event ) => {
      this.onItemSelection(event.item.title);
    });

    const { sm } = this.breakpointService.getBreakpointsMap();

    this.menuService.onItemSelect()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: { tag: string, item: any }) => {
        if (document.documentElement.clientWidth < sm) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);
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
