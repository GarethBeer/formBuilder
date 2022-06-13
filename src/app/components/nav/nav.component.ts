import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { navBarData } from './navData';
import { AppService } from '../../app.service';
import { SideBarService } from '../../shared-services/nav.service';


export interface SideNavSettings {
  collapsed?: boolean;
  screenWidth?: number;
  handset?: boolean;
  mode: string;
  position: string;
  styleClassList: string
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  // observables
  appName: Observable<string>;
  sidebarSettings$: Observable<any>
  isHandset$: Observable<any>


  // component state
  navData = navBarData
  logo: boolean = false

  @Output() onToggleSideNav: EventEmitter<SideNavSettings> = new EventEmitter();

  ngOnInit(): void {

  }

  toggleCollapse = (collapsed:boolean, mode:string ) => {
    this.sidebarService.toggleCollapse(collapsed)
  }



  constructor(private sidebarService: SideBarService, private breakpointObserver: BreakpointObserver, private appService: AppService) {
    this.sidebarSettings$ = this.sidebarService.toggleSideBar$
    this.appName = this.appService.appName$
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map((result: any) => {
          this.sidebarService.updatesideBarSettings({ handset: result.matches })

          if (result.matches) {
            this.sidebarService.updatesideBarSettings({ collapsed: result.matches })
          }
          return result.matches
        }),
        shareReplay()
      );
  }



  mouseOverlogo = (over: boolean, collapsed: boolean) => {
    if (collapsed && !over) {
      this.logo = over
    } else if (!collapsed) {
      this.logo = over
    }
  }




}
