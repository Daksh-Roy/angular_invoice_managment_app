import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterLink } from '@angular/router';
import { UploadJsonComponent } from './AppComponents/upload-json/upload-json.component';
import { HomeComponent } from './AppComponents/home/home.component';
import { NotFoundComponent } from './AppComponents/not-found/not-found.component';
import { InvoiceListComponent } from './AppComponents/invoice-list/invoice-list.component';
import { AddProductComponent } from './AppComponents/add-product/add-product.component';
import { NewInvoiceComponent } from './AppComponents/new-invoice/new-invoice.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'invoiceList',component:InvoiceListComponent},
  {path:'addProduct',component:AddProductComponent},
  {path:'newInvoice',component:NewInvoiceComponent},
  {path:'newInvoice/:invoiceID',component:NewInvoiceComponent},
  {path:'uploadJson',component:UploadJsonComponent},
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'**',component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
