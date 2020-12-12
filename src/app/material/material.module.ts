import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule
  ],
  exports: [
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule
  ]
})
export class MaterialModule { }
