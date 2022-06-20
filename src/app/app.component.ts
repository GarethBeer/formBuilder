import { Component, OnDestroy } from '@angular/core';
import { CreateModelsService } from 'create-models';
import { Subscription } from 'rxjs';
import { data } from 'src/assets/data';
import { AppService } from './app.service';
import { QueryStorageService } from './shared-services/query-storage.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  name = 'Builders App';
  classesSubscription: Subscription;


  constructor(private qs: QueryStorageService, private classesService: CreateModelsService, private appService: AppService) {
    this.classesSubscription = this.qs.getBlob('classes', 'settings').subscribe((res) => {
      this.classesService.classes = res.Classes
      console.log(res.Classes, 'APP COMPONENT')
    })
    this.qs.listBlobs('settings').subscribe((res) => console.log(res, 'BLOB LIST'))
    this.qs.listContainers().subscribe((res) => console.log(res, 'CONTAINER LIST'))
    this.appService.customers = data.customers;

   }


ngOnDestroy(): void {
  this.classesSubscription?.unsubscribe()
}

}
