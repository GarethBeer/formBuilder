import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from 'src/app/interfaces and models/models';
import { AppService } from '../../app.service';
import { SideNavSettings } from '../nav/nav.component';
import { SideBarService } from '../../shared-services/nav.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  // component state
  version: string = '1.0.0';
  release: string = 'Release-1'
  loggedIn: boolean = false;
  username: string = '';


  // observables
  collapsed: Observable<SideNavSettings>;
  appName: Observable<string>;


  constructor(private appService: AppService, private sidebarService: SideBarService) {
    this.appName = this.appService.appName$
    this.collapsed = this.sidebarService.toggleSideBar$;
   }

  async ngOnInit() {
    this.appService.userDetails = await this.getUserInfo()
  }

  async getUserInfo() {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      console.log(clientPrincipal)
      if (clientPrincipal.userId) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false
      }
      
      this.username = clientPrincipal.userDetails
      return clientPrincipal;
    } catch (error) {
      console.error('No profile could be found');
      return undefined;
    }
  }

}
