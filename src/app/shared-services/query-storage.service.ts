import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class QueryStorageService {

  constructor(private http: HttpClient) { }

  getBlob = ():Observable<any> => {
    return this.http.get('api/blob/classes')
  }

}
