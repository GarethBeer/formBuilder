import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormLibraryModule } from 'rodev-form-library';
import { LovComponent } from '../components/lov/lov.component'
import { FormComponent } from '../components/form/form/form.component';
import { FormEditComponent } from '../components/form-edit/form-edit.component';
import { FormPipe } from '../pipes/form-pipe.pipe';


@NgModule({
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, FormsModule,FormLibraryModule],
  exports: [MaterialModule, ReactiveFormsModule, CommonModule, FormsModule, FormLibraryModule, LovComponent, FormComponent, FormEditComponent,FormPipe],
  declarations: [LovComponent, FormComponent, FormEditComponent, FormPipe],
  providers: [],
})
export class SharedModule { }
