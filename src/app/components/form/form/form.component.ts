import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CreateModelsService } from 'create-models';
import {Observable, of } from 'rxjs';
import { detailedDiff } from 'src/app/utils/utils';
import { Field } from '../../form-edit/form-edit.component';

import { FormService } from '../form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnChanges {
  // inputs
  // the data
  @Input() data: any;
  // the class for shape
  @Input() cls: any;
  // the form template for the display
  @Input() formTemplate: any = null;

  @Input() form: any;
  @Input() parent: string = '';

  public combined: any;

  @Input() style: string = 'col'
  @Input() displayButton: boolean = true;
  @Input() called: string =''

  // outputs
  @Output() submit = new EventEmitter()

  // observables

  classesArr: any[] = []

  prev:any = {}


  constructor(private formService: FormService, private classes: CreateModelsService) {
  }



  ngOnChanges(changes: SimpleChanges): void {
    this.classesArr = this.classes.classes;
    console.log(this.data, this.formTemplate, this.cls)

    if (this.data) {
      this.combined = this.formService.createFormAndModel(this.data, this.cls ? this.cls : this.classesArr.find((cl) => cl.Id === this.data.Id));
    }
    if (this.parent && this.form) {
      this.combined.form = this.form.get(`${this.parent}_${this.data.Id}`)
    }
    console.log(this.combined)
  }

  onSubmit = (obj: any) => {
    if (this.checkValidatedFields().length > 0) {
      window.alert(this.checkValidatedFields().join(' , '))
    } else {
      this.submit.emit(this.combined.form.value)
    }

  }

  checkValidatedFields = () => {
    const list:string[] = []
    this.combined.model.fields.forEach((field:Field) => {
      if (field.required === 'true' && !this.combined.form[field.key]) {
        list.push(`${field.label} required`);
      }
    })
    return list;
  }

}
