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
  formFieldAppearance = "outline"


  // observables
  public readonly sidebarSetting$s: Observable<SideNavSettings>;
  public lovClass: any;
  public lovForm: any;
  private formEditForms_: BehaviorSubject<any> = new BehaviorSubject([]);
  public formEditForms$: Observable<any> = this.formEditForms_.asObservable().pipe(map(res => res ? res.modelForm : res));
  /* public readonly forms: Observable<any>; */

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
      if (cls.length > 0) {
        this.lovClass = cls.find((cl: any) => cl.Id === 'lov');
        this.lovClass ? this.lovForm = this.formService.createFormAndModel(this.lovClass, 'lov') : null;

        cls.forEach((cl) => {
          this.formEditForms_.next([...this.formEditForms_.getValue(),this.formService.createFormAndModel(cl, cl.Id)])
    })
      }

    })
  }


  // custom functions
  public changeSidenav = (settings: SideNavSettings) => {
    this.sidebarService.changeSidenav(settings);
  };

  ngOnInit(): void {
    this.classesService.classes = data.classes;

  }


  ngOnDestroy(): void {
    this.classSubscription?.unsubscribe()
  }


}
