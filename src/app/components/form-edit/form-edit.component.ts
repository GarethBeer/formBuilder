import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { CreateModelsService } from 'create-models';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FormService } from '../form/form.service';


export class Field {
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

export class Properties {
  defaultValue: string = '';
  options: string | string[] = '';
  appearance: string = '';
  icon: string = '';
  iconLocation: string = '';
  hint: string = '';
  error: string = '';
  placeholder: string = '';
}

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.scss']
})
export class FormEditComponent implements OnInit, OnChanges {
  @Input()
  testForms!: Observable<any>;
  // state
  forms: any[] = [];
  createFormForm = new FormGroup({});
  options: string[] = ['input', 'radio', 'select', 'textarea', 'checkbox'];
  models$: Observable<any[]>;
  models: any[] = [];
  field: Field = new Field();
  data: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private fb: FormBuilder, private formService: FormService, private classesService: CreateModelsService) {
    this.models$ = this.classesService.classes$.pipe(tap(cls => this.models = cls));
    this.field = new Field()
    this.createFormForm = this.fb.group({
      key: '',
      style: '',
      fields: new FormArray([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }



  createForm = () => {
    const model = this.models.find((model) => model.Id === this.createFormForm.value.key)
    if (model) {
      const fields = this.createFormForm.get('fields') as FormArray;
      Object.keys(model).forEach((k: string) => {
        if (k !== 'Id' && k !== 'type') {
          this.field.key = k;
          this.field.defaultValue = model[k];
          this.field.label = k;
          fields.push(this.fb.group(this.field))
          this.field = new Field();
        }
      })
    }
    console.log(this.createFormForm)
    this.forms.push(this.createFormForm);
    this.createFormForm = this.fb.group({
      key: '',
      style: '',
      fields: new FormArray([]),
    });
  };

  addFields = (ind: number) => {
    const form = this.forms[ind] as FormGroup;
    const arr = form.get('fields') as FormArray;
    const field = {...this.field}

    arr.push(this.fb.group(this.field) as FormGroup)
    console.log(arr)
  };

  displayForm = (index: number) => {
    const currForm = {...this.forms[index].value}
    currForm.fields.forEach((field: Field) => {
      if (field.order) {
        field.order = Number(field.order)
      }
      if (field.valuetype === 'array' && typeof field.options === 'string') {
        field.options = field.options.split(',')
      }
    })


    currForm.fields = currForm.fields.sort((a: any, b: any) => {
      return a.order - b.order
    })


    let newObj: any = {
      Id:currForm.key,
      model: currForm,
      form: this.createFormForObject(currForm)
    }
    const newForm = this.fb.group({
      key: currForm.key,
      style: currForm.style,
      fields: new FormArray([])
    })

    const fields = newForm.get('fields') as FormArray;

    currForm.fields.forEach((field:any) => {
      fields.push(this.fb.group(field))
    })


    console.log(currForm)
      this.forms.splice(index,1, newForm)

/*
this.data.next([...this.data.getValue(), newObj])
    console.log(newObj)
    console.log(this.data.getValue()) */
  };

  createFormForObject = (currentForm: any) => {
    let form: FormGroup = new FormGroup({});
    currentForm.fields.forEach((field: Field) => {
      console.log('here')
      form.addControl(field.key, new FormControl(field.defaultValue))
    })
    return form
  }



  ngOnInit(): void {
  }

}
