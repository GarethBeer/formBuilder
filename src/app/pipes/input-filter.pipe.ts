import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputFilterPipe'
})

export class InputFilterPipe implements PipeTransform {
  transform(searchList: any[], searchTerm:string): any {
   return  searchList.filter((item) => {
     if (searchTerm === '') {
      return item
    }
      if (typeof item === 'string') {
        return item.toLowerCase() === searchTerm.toLowerCase()
      }
     if (typeof item === 'object' && !Array.isArray(item)) {
        return Object.values(item).map((val:any) => val.toLowerCase()).join().includes(searchTerm.toLowerCase())
      } else {
        return item
      }
    })
  }
}
