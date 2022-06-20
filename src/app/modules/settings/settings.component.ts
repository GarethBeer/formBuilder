import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs';
import { SideNavSettings } from 'src/app/components/nav/nav.component';
import { SideBarService } from 'src/app/shared-services/nav.service';
import { CreateModelsService } from 'create-models';
import { FormService } from 'src/app/components/form/form.service';
import { data } from 'src/assets/data';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy,OnInit {
  // state
  public lovClass: any;
  public lovForm: any;

  // behavior subjects
  private formEditForms_: BehaviorSubject<any> = new BehaviorSubject([]);

  // observables
  public readonly sidebarSetting$s: Observable<SideNavSettings>;
  public formEditForms$: Observable<any> = this.formEditForms_.asObservable().pipe(map(res => res ? res.modelForm : res));

  // subscriptions
  private classSubscription: Subscription;

   // component lifecycle functions
  constructor(
    private sidebarService: SideBarService,
    public classesService: CreateModelsService,
    private formService: FormService,
    private fb: FormBuilder,
  ) {
    this.sidebarSetting$s = this.sidebarService.toggleSideBar$;
    this.classesService.classEvents$.subscribe((data: any) => {
    })

    this.classSubscription = this.classesService.classes$.subscribe((cls) => {
      console.log(cls, 'SETTINGS COMPONENT')
      if (cls.length > 0) {


        cls.forEach((cl) => {
          if (cl.Id === 'lov') {
            this.lovClass = cl;
            this.lovForm = this.formService.createFormAndModel(cl, 'lov')
          }

          /* this.formEditForms_.next([...this.formEditForms_.getValue(),this.formService.createFormAndModel(cl, cl.Id)]) */
    })
      }

    })
  }


  // custom functions
  public changeSidenav = (settings: SideNavSettings) => {
    this.sidebarService.changeSidenav(settings);
  };

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
    this.classSubscription?.unsubscribe()
  }


}
