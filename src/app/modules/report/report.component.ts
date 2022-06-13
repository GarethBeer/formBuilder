

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { QueryStorageService } from 'src/app/shared-services/query-storage.service';
import { FormService } from '../../components/form/form.service';

export interface Field {
      key: string,
      label: string,
      formtype: string,
      valuetype: string,
      placeholder: string,
      order: number,
      defaultValue: string,
      options: string | string[],
      appearance: string,
      icon: string,
      iconLocation: string,
      hint: string,
      error: string,
      matformfield: string,
      required: string,
}

export class Field {
  key: string = '';
  label: string = '';
  formtype: string = '';
  valuetype: string = '';
  placeholder: string = '';
  order: number = 0;
  defaultValue: string = '';
  options: string | string[] = '';
  appearance: string = '';
  icon: string = '';
  iconLocation: string = '';
  hint: string = '';
  error: string = '';
  matformfield: string = 'true';
  required: string = '';
}

@Component({
  selector: 'app-root',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  title = 'frontEnd';
  data: BehaviorSubject<any>;
  forms: any[] = [];
  createFormForm = new FormGroup({});
  fields: {} = {};

removeThisprop: any = {}

  options: string[] = ['input', 'radio', 'select', 'textarea', 'checkbox', 'button'];
  classes: string[] = ['formPrimary', 'formSecondary', 'formThirdly'];


  layout: any = {
    headerToolbar: {
      class: "header-toolbar"
    },
    footerToolbar: {
      class: 'footer-toolbar'
    }

  };

  constructor( private fb: FormBuilder, private formService: FormService, private queryStorage: QueryStorageService) {
    this.data = this.formService.data_;
    this.fields = new Field()

    this.createFormForm = this.fb.group({
      key: '',
      class: '',
      jsonAlt: '',
      fields: new FormArray([]),
    });
    console.log(this.fields);
  }

  ngOnInit(): void {
    this.queryStorage.getBlob().subscribe(data =>
      this.generateForm(data.data[0], 0))
  }

  createForm = () => {
    this.forms.push(this.createFormForm);
    this.createFormForm = this.fb.group({
      key: '',
      class: '',
      jsonAlt: '',
      fields: new FormArray([]),
    });
  };



  addFields = (ind: number) => {
    const form = this.forms[ind] as FormGroup;
    const arr = form.get('fields') as FormArray;
    arr.push(this.fb.group(this.fields) as FormGroup)
  };

  generateForm = (form:any, index: any = null) => {
    let currForm = { ...this.forms[index].value };
    if (currForm.jsonAlt) {
      currForm.fields = [...currForm.fields, ...JSON.parse(currForm.jsonAlt.replace(/\r\n/g, " "))]


      const fieldsArr = this.forms[index].get('fields') as FormArray;
      console.log(fieldsArr)
      const newFields = [...currForm.fields, ...JSON.parse(currForm.jsonAlt.replace(/\r\n/g, " "))]

      currForm.fields.forEach((view: any, index:number) => {
        if (view.formtype === 'radio' || view.formtype === 'checkbox') {
          currForm.fields[index].matformField = 'false';
        }
        const tempView = {...view}
        tempView.options = [view.options]
        fieldsArr.push(this.fb.group(tempView))
      })
    }


    currForm.fields.forEach((field: Field) => {
      if (field.order) {
        field.order = Number(field.order)
      }
      if (field.valuetype === 'array' && typeof field.options === 'string') {
        console.log('inside if')
        field.options = field.options.split(',')
      }
    })


    currForm.fields = currForm.fields.sort((a: any, b: any) => {
      return a.order - b.order
    })


    let newObj: any = this.createNewObj(currForm)

    this.findAndReplaceObj(newObj);



    console.log(newObj)
    console.log(this.data.getValue())
    form.get('jsonAlt').setValue('')
  };

  updateForm = (form: any, index: any = null) => {

    this.findAndReplaceObj(this.createNewObj(this.forms[index].value))
  }

  findAndReplaceObj = (newObj: any) => {
    console.log(this.data.getValue(), newObj)
   const indy = this.data.getValue().findIndex((form:any) => form.id === newObj.id)
    console.log(indy)
    const theData = [...this.data.getValue()]
    theData.map((data: any) => {
      data.model.fields.forEach((fields:any) => {
        if (fields.formtype === 'button') {
          console.log('reached here', fields.key,document.getElementById(fields.key) )
         document.getElementById(fields.key)?.addEventListener('click', this.testFunc1)
        }
})
     })
    if (indy !== -1) {
      const theData = [...this.data.getValue()]
      const removed = theData.splice(indy, 1, newObj);
      this.data.next(theData)
      console.log(this.data)
    } else {
      this.data.next([...this.data.getValue(), newObj])
    }
  }

  createNewObj = (currForm:any) => {
    let newObj: any = {
      id:currForm.key,
      model: currForm,
      form: this.createFormForObject(currForm)
    }
    console.log(newObj)
    return newObj
  }

  orderFields = (index:number) => {
    const form = { ...this.forms[index].value };
    const fields = this.forms[index].get('fields') as FormArray;
    form.fields.forEach((field: Field, index: number) => {
      field.order = field.order === 0 ? index : 0

    })
    this.findAndReplaceObj(this.createNewObj(form));


    fields.controls.forEach((control, index) => {
      const orderField = control.get('order') as FormControl;
      if (orderField.value === 0) {
        orderField.setValue(index)
      } else {
        orderField.setValue(0)
      }
    })
    console.log(fields)
  }


  createFormForObject = (currentForm: any) => {
    let form: FormGroup = new FormGroup({});
    currentForm.fields.forEach((field: Field) => {
      if (field.required === 'Yes') {
        form.addControl(field.key, new FormControl(field.defaultValue, Validators.required))
      } else {

        form.addControl(field.key, new FormControl(field.defaultValue))
      }
    })
    return form
  }

  printForm = (event: any) => {
    window.alert(JSON.stringify(event.value))
    console.log(event)
  }


  testFunc = () => {
    window.alert('test func')
  }
  testFunc1 = () => {
    window.alert('test func 2')
  }

  drop(event: any, ind:number) {
    console.log(event)
    const form = this.forms[ind].get('fields') as FormArray;
    const curr = form.at(event.previousIndex);

    form.removeAt(event.previousIndex)
    form.insert(event.currentIndex, curr)
  }

  deleteField = (formIndex:number, fieldIndex:number) => {
    this.forms[formIndex].get('fields').removeAt(fieldIndex)
  }


}
