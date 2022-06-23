import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { SharedModule } from '../shared.module';
import { NgxSearchFieldModule} from 'ngx-search-field'




@NgModule({
  declarations: [
    CustomersComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    NgxSearchFieldModule
  ]
})
export class CustomersModule { }
