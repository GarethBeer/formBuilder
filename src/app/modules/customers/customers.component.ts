import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CreateModelsService } from 'create-models';
import { Observable, tap } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { FormService } from 'src/app/components/form/form.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnDestroy {
  customers$: Observable<any>;
  viewCustomerDetails: any = null;
  customerClass: any = null;
  customer: any = null
  model = null
  newForm: any = null;

  constructor(
    private appService: AppService,
    private formService: FormService,
    private classesService: CreateModelsService
  ) {
    this.customers$ = this.appService.customers$.pipe(tap(data => console.log(data)));
    this.classesService.classes$.subscribe((data: any) => {
      if (!this.customerClass) {
        this.customerClass = data?.find((cl: any) => cl.Id === 'customer');
      }
    });
  }

  viewCustomer = (customer: any) => {
    let model = this.formService.formTemplates.find((m: any) => {
      return m?.value?.key === 'customer';
    });

    this.customer = customer;
    if (model) {
      console.log(model, 'MODEL')
     this.model = model.value;
    }

  };

  addCustomer = () => {
    const model = this.formService.formTemplates.find((m: any) => {
      return m.value?.key === 'customer';
    });
    if (model) {
      this.model = model.value
    }

    this.newForm = true;
  }

  submit = (data: any) => {
    this.appService.customer = data
    console.log(data)
  }
  ngOnDestroy(): void {

  }
}
