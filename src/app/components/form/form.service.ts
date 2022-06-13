import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Form, FormField } from 'rodev-form-library';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FormService {
  data_: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  data$: Observable<any[]> = this.data_.asObservable();
  formName_: BehaviorSubject<string> = new BehaviorSubject<string>('');
  formName$: Observable<string> = this.formName_.asObservable();

  constructor(private fb: FormBuilder) { }

  checkFormExists = (title: string) => {
    return this.data_.getValue().findIndex((form) => form?.Id === title)
  }

  checkDifferences = (title: string, data: any) => {
    const formToCheck = this.data_.getValue().find((data: any) => data.Id && data.Id === title).form.value
    console.log(formToCheck, data)
    const diff: any = {}
    Object.keys(data).forEach((key: string) => {
      if (typeof data[key] !== 'object') {
        if (data[key] !== formToCheck[key]) {
          diff[key] = data[key]
        }
      } else {
        if (Array.isArray(data[key])) {
          Object.entries((items:any) => {
            if (typeof items === 'object') {

            }
       })

          }
      }

    })
    return diff || false
  }

  replaceForm = (ind: number, data:any) => {
    const formsArray = [...this.data_.getValue()];
    formsArray.splice(ind, 1);
    this.data_.next([...formsArray, data])
  }

  createNewFormModel = (data: any): FormGroup => {
    const fieldArr: FormArray = new FormArray([]);
    Object.entries(data)
      .map((data) => this.createField(data))
      .forEach((data) => fieldArr.push(this.fb.group({...data})));

    const formModel:any = {};
    formModel.key = data.Id || '';
    formModel.style = data.style || '';
    formModel.fields = new FormArray([])
    const form = this.fb.group({ ...formModel })
    const fields = form.get('fields') as FormArray;
    Object.entries(data)
      .map((data) => this.createField(data))
      .forEach((data) => fields.push(this.fb.group({...data})));
    return form;
  };

  createField = (data: any) => {
    const field = new FormField();
    field.key = data[0];
    field.label = data[0]
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str: any) => str.toUpperCase());
    field.properties.defaultValue = data[1];
    if (Array.isArray(data[1])) {
      field.valuetype = 'array';
      field.formtype = 'select';
      field.properties.options = data[1];
      field.properties.defaultValue = data[1].length > 1 ? data[1] : data[1][0];
    }
    return field;
  };

  createFormForm = (formModel: any) => {
    const { fields } = formModel;
    const formGroup = this.fb.group({});
    fields.forEach((field:any) => {
      if (field.required === 'true') {
        formGroup.addControl(
          field.key,
          new FormControl(field.defaultValue, Validators.required)
        );
      } else {
        formGroup.addControl(
          field.key,
          new FormControl(field.defaultValue)
        );
      }
    });
    return formGroup;
  };

  createFormAndModel = (data: any, title:string) => {
    return {
      Id: title,
      form: this.createFormForm(this.createNewFormModel(data).value),
      model: this.createNewFormModel(data).value,
      modelForm: this.createNewFormModel(data)
    };
  };
}
