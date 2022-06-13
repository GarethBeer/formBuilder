import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SideNavSettings } from './components/nav/nav.component';
import { UserInfo } from './interfaces and models/models';

@Injectable({providedIn: 'root'})
export class AppService {
  private appName_: BehaviorSubject<string> = new BehaviorSubject<string>('test1');
  readonly appName$: Observable<string> = this.appName_.asObservable()



  private userDetails_: BehaviorSubject<UserInfo> = new BehaviorSubject<UserInfo>(new UserInfo())

  readonly userDetails$: Observable<UserInfo> = this.userDetails_.asObservable()

  set userDetails(obj: UserInfo) {
    this.userDetails_.next(obj)
  }


  constructor() { }

}
