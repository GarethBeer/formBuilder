import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  @Input() arr: any[] = [];
  @Input() appearance: MatFormFieldAppearance = 'outline'
  inputControl: FormControl = new FormControl('');
  inputSubscription: Subscription;
  @Output() submitValue: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.inputSubscription = this.inputControl.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((input: string) => {
      if (!input) {
        this.submitValue.emit(null)
      }
    })
  }
  submitValueFunc = (value:any) => {
    this.submitValue.emit(value)
  }

  clearControl = () => {
    this.inputControl.setValue('');
    this.submitValue.emit(null)
  }

  ngOnDestroy(): void {
    this.inputSubscription?.unsubscribe();
  }

}


