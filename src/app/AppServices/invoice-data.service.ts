import { Injectable } from '@angular/core';
import { InvoiceData } from '../Interfaces/invoice-data';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDataService {

  private _invoiceData: InvoiceData[]|null=null;

  private _displayedColumns: string[] = ['No','Full Name','Invoice Date','Total Amount', 'Edit', 'Delete'];

  constructor(private _storage: LocalStorageService) {}


  public gelAllInvoices(): InvoiceData[]{
    this._invoiceData = JSON.parse(this._storage.get("InvoiceList"));

    if(this._invoiceData!==null){
      return this._invoiceData;
    }
    return [];
  }

  public getTodayInvoices(): InvoiceData[] {
    this._invoiceData = JSON.parse(this._storage.get("InvoiceList"));

    let currentDate = new Date().toISOString().split('T')[0];
    let todayInvoices: InvoiceData[] = [];
    if(this._invoiceData!==null){
      for (let invoice of this._invoiceData) {
        if (invoice.date == currentDate) {
          todayInvoices.push(invoice);
        }
      }
      return todayInvoices;
    }else{
      return [];
    }
  }

  public getFields(): string[] {
    return this._displayedColumns;
  }
}
