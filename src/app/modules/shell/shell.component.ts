import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { SideBarService } from 'src/app/shared-services/nav.service';
import { AppService } from '../../app.service';
import { SideNavSettings } from '../../components/nav/nav.component';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  toggleSideBar$: Observable<string>;

  constructor(private sidebarService: SideBarService) {
    this.toggleSideBar$ = this.sidebarService.toggleSideBar$.pipe(
      map((data: SideNavSettings) => {
        let body = data.collapsed || data.mode === 'over' ? 'body-trimmed' : 'body-open';
        let pos = data.position.split('-')[1]
        let styleClass = body + '-' + pos;
        return styleClass;
      })
    );
  }

  ngOnInit(): void {}
}
