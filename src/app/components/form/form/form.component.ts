import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {Observable, of } from 'rxjs';

import { FormService } from '../form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnChanges {
  // inputs
  @Input() model:any;
  @Input() formname: string = '';
  @Input() style: string = 'col'

  // outputs
  @Output() submit = new EventEmitter()

  // observables
  formName: Observable<any> = of();


  constructor(private formService: FormService) {
  }

  hasOwnProperty = (obj: any, key: any) => {
    console.log(obj, key)
    return Object.prototype.hasOwnProperty.call(obj, key)
  }

  isObject = (obj: any): boolean => {
    return  obj != null && typeof obj === 'object' && !Array.isArray(obj)
   };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] && this.isObject(changes['model'].currentValue.value) && !this.hasOwnProperty(changes['model'].currentValue.value, 'model')) {
      console.log('hello')
      this.model = {
        model: {...changes['model'].currentValue.value},
        form: this.formService.createFormForm(changes['model'].currentValue.value),
        Id:changes['model'].currentValue.value.Id
      }
      console.log(this.model)
    }
  }

  onSubmit = (obj: any) => {
    console.log(obj.form.value)
    this.submit.emit(obj.form.value)
  }

}
