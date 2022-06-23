import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputFilterPipe'
})

export class InputFilterPipe implements PipeTransform {

  transform(searchList: any[], searchTerm: string,): any {
    console.log('SEARCH LIST',searchList.filter((item) => {
      if (searchTerm === '') {
       return item
     }
       if (typeof item === 'string') {
         return item?.toLowerCase().search(new RegExp(searchTerm,'gi')) > -1
       }
       if (typeof item === 'object' && !Array.isArray(item)) {
         if (this.transform(Object.values(item), searchTerm).length > 0) {
           return item
         }
       } else {
         return item
       }
     }))
    return searchList.filter((item) => {
     if (searchTerm === '') {
      return item
    }
      if (typeof item === 'string') {
        return item?.toLowerCase().search(new RegExp(searchTerm,'gi')) > -1
      }
      if (typeof item === 'object' && !Array.isArray(item)) {
        if (this.transform(Object.values(item), searchTerm).length > 0) {
          return item
        }
      } else {
        return item
      }
    })

  }

}
