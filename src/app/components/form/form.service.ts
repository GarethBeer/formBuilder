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
import { hasOwnProperty } from 'src/app/utils/utils';
import { Field } from '../form-edit/form-edit.component';

export class FormField {
  key: string = '';
  label: string = '';
  formtype: string = 'input';
  valuetype: string = '';
  order: number = 0;
  matformfield: string = 'true';
  defaultValue: string = '';
  options: string | string[] = '';
  appearance: string = 'outline';
  icon: string = '';
  iconLocation: string = '';
  hint: string = '';
  required: string = 'false';
  error: string = '';
  placeholder: string = '';
  max: number = 150;
  min: number = 1;
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
    private classesService: CreateModelsService
  ) {}

  // functions
  createNewFormModel = (data: any): FormGroup => {
    console.log(data, 'DATA')
    const formModel: any = {};
    const children: any[] = [];
    const childArr:any[] = []

    formModel.key = data.Id || '';
    formModel.style = data?.style || '';
    formModel.fields = new FormArray([]);
    formModel.children = new FormControl([]);
    formModel.childArr = new FormControl([]);

    const form = this.fb.group({ ...formModel });
    const fields = form.get('fields') as FormArray;

    Object.entries(data).forEach((item: any) => {

      if (typeof item[1] === 'object' && !Array.isArray(item[1])) {
        console.log(item)
        children.push(this.createChild(item[1]));
      } else if (Array.isArray(item[1])) {
        const arr:any = []
        item[1].forEach((el) => {
          console.log(el)
          arr.push(this.createChild(el))
        })
        children.push(arr)
      }
      else {
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

  addingValidators = (field: any): Validators[] => {
    const validators: Validators[] = [];
    if (field.valuetype === 'phone') {
      validators.push(Validators.minLength(11));
      /* validators.push(Validators.pattern('[0-9]')) */
    }
    if (field.required === 'true') {
      validators.push(Validators.required);
    }
    return validators;
  };

  createFormFromObject = (obj: any, cls: any, model: any = null): FormGroup => {
    const formGroup = new FormGroup({});
    Object.keys(cls ? cls : obj).forEach((k) => {
      if (typeof cls[k] === 'string') {
        if (model) {
          const field = model.fields.find((field: Field) => field.key === k);
          const validators: Validators = this.addingValidators(field);
          formGroup.addControl(k, new FormControl(obj[k], validators));
        } else {
          formGroup.addControl(k, new FormControl(obj[k]));
        }
      } else if (Array.isArray(cls[k])) {
        const formArray = new FormArray([]);
        if (obj[k]) {
          obj[k].forEach((el: any) => {
            formArray.push(this.createFormFromObject(el, cls[k][0]));
          });

        }
        formGroup.addControl(k,formArray)
      } else if (typeof obj[k] === 'object' || typeof cls[k] === 'object') {
        if (obj[k]) {
          formGroup.addControl(k, this.createFormFromObject(obj[k], cls[k]));
        } else {
          formGroup.addControl(k, this.createFormFromObject(cls[k], cls[k]));
        }
      } else {
        formGroup.addControl(k, new FormControl(cls[k]));
      }
    });
    return formGroup;
  };

  createChild = (child: any) => {
    console.log(child, 'CHILD 1')
    const cls = this.classesService.classes.find(
      (cl: any) => cl.Id === child.Id
    );
    const formTemplate = this.formTemplates?.find(
      (template) => template.value.key === child.Id
    );

    return {
      cls: cls,
      data: child,
      template: formTemplate,
    };
  };

  createFormAndModel = (data: any, dataClass: any) => {
    const foundTemplate = this.formTemplates.find(
      (template) => template.value.key === dataClass.Id
    );
    if (foundTemplate) {
      this.checkForUpdatesToClass(foundTemplate, dataClass);
    }

    const newForm = this.createFormFromObject(
      data,
      dataClass,
      foundTemplate?.value
    );

    return {
      Id: data.Id ? data.Id : dataClass.Id,
      form: newForm,
      model: foundTemplate
        ? foundTemplate.value
        : this.createNewFormModel(newForm.value).value,
    };
  };

  adjustLabel = (data: any, cl: string) => {
    data = data.replace(/_/g, ' ');
    if (data?.toLowerCase().includes(cl)) {
      data = data.split(' ').map((word: any) => {
        const firstChar = word.charAt(0).toUpperCase();

        return firstChar + word.slice(1);
      });
      data.splice(0, 1);
      return data.join(' ');
    }
    return data;
  };

  checkForUpdatesToClass = (template: any, dataClass: any) => {

    const anyObj: any = {};
    template.value.fields.forEach((field: any) => {
      anyObj[field.key] = field.defaultValue;
    });

    const fields = template.get('fields') as FormArray;
    Object.entries(dataClass).forEach((key: [string, any]) => {
      if (!hasOwnProperty(anyObj, key[0]) && typeof key[1] === 'string') {
        fields.push(this.fb.group({ ...this.createField(key, dataClass.Id) }));
      } else if (
        !hasOwnProperty(anyObj, key[0]) &&
        typeof key[1] === 'object'
      ) {
        const childArr = template.value.children?.filter((child:any) => {
          child.cls.Id === key[1].Id
        })
        console.log('PROPERTY', key[0])
        console.log('CHILDARR', childArr)
      }
    });
    console.log(template, 'template');
    return template;
  };
}
