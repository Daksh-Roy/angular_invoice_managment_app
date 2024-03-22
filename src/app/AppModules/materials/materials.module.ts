import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';




const materialComponent = [
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatTableModule,
  MatSlideToggleModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  NativeDateModule,
  MatRadioModule,
  MatCardModule,
  MatFormFieldModule,
  MatDialogModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    materialComponent
  ],
  exports: [materialComponent]
})
export class MaterialsModule { }
