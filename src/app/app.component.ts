import { Component } from '@angular/core';
import { QueryStorageService } from './shared-services/query-storage.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  name = 'Builders App';


  constructor(private qs: QueryStorageService) {
    this.qs.getBlob().subscribe((res)=> console.log(res))
   }



}
