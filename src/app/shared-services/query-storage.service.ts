import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class QueryStorageService {

  constructor(private http: HttpClient) { }

  getBlob = (blob: string, container: string):Observable<any> => {
    return this.http.get(`api/getBlob`,
      {
        params: new HttpParams()
          .set('id', blob)
          .set('container', container)
      })
  }

  listBlobs = (container: string):Observable<any> => {
    return this.http.get(`api/blob-list/${container}`)
  }


  listContainers = () => {
    return this.http.get(`api/container-list`)
  }



}
