import { Injectable } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CreateModelsService } from 'create-models';
/* import { Form, FormField } from 'rodev-form-library'; */
import { BehaviorSubject, Observable } from 'rxjs';
import { Field } from '../form-edit/form-edit.component';

export class FormField {
  key: string = '';
  label: string = '';
  formtype: string = 'input';
  valuetype: string = '';
  order: number = 0;
  matformfield: string = 'true';
  /* properties: Properties = new Properties() */
  defaultValue: string = '';
  options: string | string[] = '';
  appearance: string = 'outline';
  icon: string = '';
  iconLocation: string = '';
  hint: string = '';
  required: string = 'false';
  error: string = '';
  placeholder: string = '';
}

@Injectable({ providedIn: 'root' })
export class FormService {
  // behavior subjects
  private readonly formTemplates_: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);

  // observables
  public data$: Observable<any[]> = this.formTemplates_.asObservable();

  // getters
  get formTemplates() {
    return this.formTemplates_.getValue();
  }

  // setters
  set formTemplate(template: any) {
    const formTemplates = this.formTemplates;
    const doesItExist = formTemplates.findIndex(
      (temp) => temp.value.key === template.value.key
    );
    if (doesItExist > -1) {
      formTemplates.splice(doesItExist, 1, template);
    } else {
      this.formTemplates_.next([...formTemplates, template]);
    }
  }

  set formTemplates(templatesArr: any[]) {
    this.formTemplates_.next(templatesArr);
  }

  constructor(
    private fb: FormBuilder,
    private classesService: CreateModelsService,
    private formService: FormService
  ) {}

  // functions
  createNewFormModel = (data: any): FormGroup => {
    const formModel: any = {};
    const children: any[] = [];

    formModel.key = data.Id || '';
    formModel.style = data?.style || '';
    formModel.fields = new FormArray([]);
    formModel.children = new FormControl([]);
    const form = this.fb.group({ ...formModel });
    const fields = form.get('fields') as FormArray;
    Object.entries(data).forEach((item: any) => {
      if (typeof item[1] === 'object') {
        children.push(this.createChild(item[1]));
      } else {
        fields.push(this.fb.group({ ...this.createField(item, data.Id) }));
      }
    });
    form.get('children')?.setValue(children);
    return form;
  };

  createField = (data: any, prefix: string) => {
    const field = new FormField();
    field.key = data[0];
    field.label = this.adjustLabel(data[0], prefix);
    field.defaultValue = data[1];
    if (Array.isArray(data[1])) {
      field.valuetype = 'array';
      field.formtype = 'select';
      field.options = data[1];
      field.defaultValue = data[1].length > 1 ? data[1] : data[1][0];
    }
    return field;
  };
/*
  createFormForm = (formModel: any) => {
    console.log(formModel);
    const { fields, children } = formModel;
    const formGroup = this.fb.group({});
    fields.forEach((field: any) => {
      if (field.required === 'true') {
        formGroup.addControl(
          field.key,
          new FormControl(field.defaultValue, Validators.required)
        );
      } else {
        formGroup.addControl(field.key, new FormControl(field.defaultValue));
      }
    });
    children.forEach((child: any) => {
      formGroup.addControl(child.Id, child.form);
    });
    return formGroup;
  }; */

  createFormFromObject = (obj: any, cls: any, model:any =null): FormGroup => {
    const formGroup = new FormGroup({});
    Object.keys(cls ? cls : obj).forEach((k) => {
      if (typeof obj[k] === 'string') {
        if (model) {
          const field = model.fields.find((field: Field) => field.key === k);
          field?.required === 'true' ? formGroup.addControl(k, new FormControl(obj[k], Validators.required)) : formGroup.addControl(k, new FormControl(obj[k]));
        } else {
          formGroup.addControl(k, new FormControl(obj[k]));
        }
      } else if (Array.isArray(obj[k]) || Array.isArray(cls[k])) {
        const formArray = new FormArray([]);
        if (obj[k]) {
          obj[k].forEach((el: any) => {
            formArray.push(this.createFormFromObject(el, cls[k][0]));
          });
        } else {
          cls[k].forEach((el: any) => {
            formArray.push(this.createFormFromObject(el, el));
          });
        }
      } else if (typeof obj[k] === 'object' || typeof cls[k] === 'object') {
        if (obj[k]) {
          formGroup.addControl(k, this.createFormFromObject(obj[k], cls[k]));
        } else {
          formGroup.addControl(
            k,
            this.createFormFromObject(cls[k], cls[k])
          );
        }
      } else {
        formGroup.addControl(k, new FormControl(cls[k]));
      }
    });
    return formGroup;
  };

  createChild = (child: any) => {
    const cls = this.classesService.classes.find(
      (cl: any) => cl.Id === child.Id
    );
    const formTemplate = this.formTemplates?.find(
      (template) => template.value.key === child.Id
    );
    console.log('CREATE CHILD', formTemplate, this.formTemplates);
    return {
      cls: cls,
      data: child,
      template: formTemplate,
    };
  };

  createFormAndModel = (data: any, dataClass: any) => {
    const foundModel = this.formTemplates.find(
      (template) => template.value.key === dataClass.Id
    );
    const newForm = this.createFormFromObject(data, dataClass, foundModel?.value);

    return {
      Id: data.Id ? data.Id : dataClass.Id,
      form: newForm,
      model: foundModel
        ? foundModel.value
        : this.createNewFormModel(newForm.value).value,
    };
  };

  adjustLabel = (data: any, cl: string) => {
    data = data.replace(/_/g, ' ');

    if (data.toLowerCase().includes(cl)) {
      data = data.split(' ').map((word: any) => {
        const firstChar = word.charAt(0).toUpperCase();

        return firstChar + word.slice(1);
      });
      data.splice(0, 1);
      return data.join(' ');
    }
    return data;
  };
}
