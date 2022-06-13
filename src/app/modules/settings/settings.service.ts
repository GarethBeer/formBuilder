import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CreateModelsService } from 'create-models';

@Injectable({providedIn: 'root'})
export class SettingsService {
  // behavior subjects
  private lovs_: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])

  // observables
  readonly lovs$: Observable<any[]> = this.lovs_.asObservable();

  // setters
  set lovs(lovs:any[]) {
    this.lovs_.next(lovs)
  }

  set lov(lov: any) {
    this.lovs_.next([...this.lovs, lov])
  }

  // getters
  get lovs() {
    return this.lovs_.getValue()
  }

  constructor(private http: HttpClient, private classesService: CreateModelsService) { }


  getAndSetLookups = ():Observable<any>  => {
   return this.http.get('/getBlob', {
      params: new HttpParams()
        .set('account', 'garethb33rtesting')
        .set('container', 'forms')
        .set('blob', 'formdata.json'),
    }).pipe((tap((res: any) =>  this.lovs = res)))
  }



}
