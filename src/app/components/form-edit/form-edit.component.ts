import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { CreateModelsService } from 'create-models';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FormService } from '../form/form.service';


export class Field {
  key: string = '';
  label: string = '';
  formtype: string = 'input';
  valuetype: string = 'text';
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
  forms$: Observable<any>;
  forms: any[] = [];
  createFormForm = new FormGroup({});
  options: string[] = ['input', 'radio', 'select', 'textarea', 'checkbox'];
  classes$: Observable<any[]>;
  classes: any[] = [];
  field: Field = new Field();
  data: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private fb: FormBuilder, private formService: FormService, private classesService: CreateModelsService) {
    this.classes$ = this.classesService.classes$.pipe(tap(cls => this.classes = cls));
    this.field = new Field()
    this.createFormForm = this.fb.group({
      key: '',
      style: '',
      fields: new FormArray([]),
    });
    this.forms$ = this.formService.data$.pipe(tap(data => {
      console.log(data)
      this.forms = data
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }



  createForm = () => {
    const cls = this.classes.find((cls) => cls.Id === this.createFormForm.value.key);
    let model = this.createFormForm;
    if (cls) {
       model = this.formService.createNewFormModel(cls)
    }

    this.formService.formTemplate =  model
    this.createFormForm = this.fb.group({
      key: '',
      style: '',
      fields: new FormArray([]),
      children: [],
    });
  };

  addFields = (ind: number) => {
    const form = this.forms[ind] as FormGroup;
    const arr = form.get('fields') as FormArray;
    arr.push(this.fb.group(this.field) as FormGroup)
  };

  displayForm = (index: number) => {
    const currForm = { ...this.forms[index].value }

    currForm.fields = currForm.fields.sort((a: any, b: any) => {
      return a.order - b.order
    })

    const newForm = this.fb.group({
      key: currForm.key,
      style: currForm.style,
      fields: new FormArray([]),
      children: new FormControl()
    })

    const fields = newForm.get('fields') as FormArray;
    const children = newForm.get('children') as FormControl;

    children.setValue([...currForm.children])
    currForm.fields.forEach((field: any, index: number) => {
      if (field.order) {
        field.order = Number(field.order)
      }
      if (field.formtype === 'radio' || field.formtype === 'checkbox') {
        field.matformfield = ''
      }
      fields.push(this.fb.group(field))
    })


    this.formService.formTemplate = newForm;
    console.log(this.formService.formTemplates, 'FORMEDIT')
  };


  ngOnInit(): void {
  }

}
