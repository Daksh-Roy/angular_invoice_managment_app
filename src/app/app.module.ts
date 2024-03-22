import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialsModule } from './AppModules/materials/materials.module';
import { HeaderComponent } from './AppComponents/header/header.component';
import { UploadJsonComponent } from './AppComponents/upload-json/upload-json.component';
import { HomeComponent } from './AppComponents/home/home.component';
import { NotFoundComponent } from './AppComponents/not-found/not-found.component';
import { InvoiceTableComponent } from './AppComponents/UtilityComponent/invoice-table/invoice-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { InvoiceListComponent } from './AppComponents/invoice-list/invoice-list.component';
import { AddProductComponent } from './AppComponents/add-product/add-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UpdateProductComponent } from './AppComponents/UtilityComponent/update-product/update-product.component';
import { NewInvoiceComponent } from './AppComponents/new-invoice/new-invoice.component';
import { FormateAmountPipe } from './AppComponents/UtilityComponent/formate-amount.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UploadJsonComponent,
    HomeComponent,
    NotFoundComponent,
    InvoiceTableComponent,
    InvoiceListComponent,
    AddProductComponent,
    UpdateProductComponent,
    NewInvoiceComponent,
    FormateAmountPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
