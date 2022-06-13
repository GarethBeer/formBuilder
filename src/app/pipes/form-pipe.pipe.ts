import { Pipe, PipeTransform } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Pipe({
  name: 'formPipe'
})

export class FormPipe implements PipeTransform {
  constructor(private fb: FormBuilder){}
  transform(value: any, ...args: any[]): any {
    if (Array.isArray(value)) {
      const copy = value.slice()
      return copy.map((val) => this.fb.group({...val}))
    } else {
      const copy = this.fb.group({...value})
      return copy
    }


  }
}
