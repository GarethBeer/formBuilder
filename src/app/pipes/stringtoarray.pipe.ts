import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringtoarray'
})
export class StringtoarrayPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): any[] {
    return value.split(",");
  }

}
