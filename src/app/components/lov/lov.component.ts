import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormLibraryService } from 'rodev-form-library';
import { BehaviorSubject, find, findIndex, map, Observable, single, tap } from 'rxjs';
import { Model } from 'src/app/interfaces and models/models';
import { FormService } from '../form/form.service';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-lov',
  templateUrl: './lov.component.html',
  styleUrls: ['./lov.component.scss']
})
export class LovComponent implements OnInit, OnChanges {
  @Input() lovClass: any;
  @Input() lovForm: any;
  // state
  public displayForm: boolean = true;
  public lovName: string = '';
  public displayAttributes: any[] = []

  public forms: FormGroup[] = []


  // behavior subjects
  private readonly lookups_: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  private readonly forms_: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])

  // observables
  readonly lookups$: Observable<any> = this.lookups_.asObservable();

  forms$: Observable<any> = this.forms_.asObservable();




  constructor(private formService: FormService, private fb: FormBuilder) {

  }

ngOnChanges(changes: SimpleChanges): void {
  if (this.lovClass) {
   this.lookups_.getValue().forEach((lov) => lov.values = lov.values.map((val:any) => {
      const model:any = new Model(this.lovClass);
      Object.keys(model).forEach((k) => model[k] = val[k])
      return model
    }))
    console.log(this.lookups_.getValue())
  }
}

  createLookup = () => {
    const lookup = {
      Id: this.lovName,
      type: 'lov',
      values: []
    }
    this.lookups_.next([...this.lookups_.getValue(), lookup])
    this.lovName = ''
  }

  ngOnInit(): void {
  }

  handleSubmits = (formData: any, Id: string) => {
    const lovs = [...this.lookups_.getValue()]
    const findLookup = {...lovs.find(lov => lov.Id === Id)};
    const findInd = lovs.findIndex(lov => lov.Id === Id);
    if (findLookup) {
      formData.Id = uuid();
      formData.type = 'lov_attribute';
      findLookup.values.push(formData);
      lovs.splice(findInd, 1, findLookup);
      this.lookups_.next(lovs);
    }
    this.lovForm.form.reset()
  }


  editField = (lov: any, index: number, field: any) => {
    const lovs = [...this.lookups_.getValue()]
    const ind = this.lookups_.getValue().findIndex((l) => l.Id === lov.Id);
    this.lookups_.getValue()[ind].values.splice(index, 1, field.value);
/*     this.lookups_.next(lovs); */
    // create an event

  }

  deleteField = (lov:any, index:number) => {
    const ind = this.lookups_.getValue().findIndex((l) => l.Id === lov.Id);
    this.lookups_.getValue()[ind].values.splice(index, 1);
    this.lookups_.next(this.lookups_.getValue())
  }

}
