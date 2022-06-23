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

  @Input() public arr: any[] = [];
  @Input() public appearance: MatFormFieldAppearance = 'outline'
  @Input() public fieldLabel: string = 'Search'
  @Input() public fieldToDisplay: string = ''
  public inputControl: FormControl = new FormControl('');
  private inputSubscription: Subscription;
  @Output() public submitValue: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.inputSubscription = this.inputControl.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((input: string) => {
      if (!input) {
        this.submitValue.emit(null)
      }
    })
  }
  public submitValueFunc = (value: any):void => {
    this.submitValue.emit(value)
  }

  public clearControl = (): void => {
    this.inputControl.setValue('');
    this.submitValue.emit(null)
  }

  ngOnDestroy(): void {
    this.inputSubscription?.unsubscribe();
  }

}


