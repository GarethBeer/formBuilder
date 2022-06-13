import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { SideNavSettings } from '../components/nav/nav.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class SideBarService {
  // state
  sidenavDefaultSettings: SideNavSettings = {
    collapsed: false,
    screenWidth: 0,
    handset: false,
    mode: 'side',
    position: 'sidenav-left-side',
    styleClassList: 'sidenav sidenav-left-side open',
  };

  //  behavior subjects / subjects
  private toggleSideBar_: BehaviorSubject<SideNavSettings> =
    new BehaviorSubject<SideNavSettings>(this.sidenavDefaultSettings);

  // observables
  readonly toggleSideBar$: Observable<SideNavSettings> =
    this.toggleSideBar_.asObservable();

  //getters and setters
  set toggleSideBar(obj: SideNavSettings) {
    this.toggleSideBar_.next(obj);
  }

  set updatesideBarSettings(settings: any) {
    let currentSettings: any = { ...this.toggleSideBar_.getValue() };
    Object.entries(settings).forEach((keyvalue: any[]) => {
      currentSettings[keyvalue[0]] = keyvalue[1];
    });
    this.toggleSideBar_.next(currentSettings);
  }

  // functions
  toggleCollapse = (collapsed: boolean): void => {
    this.updatesideBarSettings = { collapsed: collapsed };
    this.updateSidenavStyle(
      this.toggleSideBar_.getValue().styleClassList,
      collapsed
    );
  };

  updateSidenavStyle = (cl: string, collapsed: boolean) => {
    let newStyle = cl;

    if (collapsed) {
      newStyle = this.removeClass(newStyle, 'open');
      newStyle = this.addClass(newStyle, 'collapsed');
      this.updatesideBarSettings = { styleClassList: newStyle };
    } else {
      newStyle = this.addClass(newStyle, 'open');
      newStyle = this.removeClass(newStyle, 'collapsed');
      this.updatesideBarSettings = { styleClassList: newStyle };
    }
  };

  removeClass = (cl: string, item: string) => {
    if (!item || !cl) {
      return '';
    }
    let tempCl = [...cl.split(' ')];
    const index = tempCl.indexOf(item);
    if (index > -1) {
      tempCl.splice(index, 1);
      cl = tempCl.join(' ');
      console.log(cl);
    }
    return cl;
  };

  addClass = (cl: string, item: string) => {
    let tempCl = [...cl.split(' ')];
    const index = tempCl.indexOf(item);
    if (index === -1) {
      tempCl.push(item);
      return tempCl.join(' ');
    }
    return 'sidenav';
  };

  changeSidenav = (sidebarSettings: SideNavSettings | string) => {
    const positionsPossible = [
      'sidenav-left-side',
      'sidenav-right-side',
      'sidenav-bottom',
    ];
    if (typeof sidebarSettings === 'object') {
      positionsPossible.forEach((pos: string) => {
        if (
          sidebarSettings.styleClassList.includes(pos) &&
          sidebarSettings.position
        ) {
          sidebarSettings.styleClassList = this.removeClass(
            sidebarSettings.styleClassList,
            pos
          );
          sidebarSettings.styleClassList = this.addClass(
            sidebarSettings.styleClassList,
            sidebarSettings.position
          );
        }
      });
    }
    this.updatesideBarSettings = sidebarSettings;
  };

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map((result: any) => {
          this.updatesideBarSettings = {
            handset: result.matches,
          };

          if (result.matches) {
            this.updatesideBarSettings = {
              collapsed: result.matches,
              position: 'sidenav-bottom',
              styleClassList: 'sidenav sidenav-bottom',
            };
          }
          return result.matches;
        }),
        shareReplay()
      )
      .subscribe((data) => console.log(data));
  }
}
