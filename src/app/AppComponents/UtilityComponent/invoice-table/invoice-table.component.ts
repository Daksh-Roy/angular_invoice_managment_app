import { AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import { InvoiceData } from '../../../Interfaces/invoice-data';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceDataService } from '../../../AppServices/invoice-data.service';
import { LocalStorageService } from '../../../AppServices/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrl: './invoice-table.component.scss'
})
export class InvoiceTableComponent implements OnInit, AfterContentChecked {

  public _invoices: InvoiceData[] = [];
  public _invoiceTableDataSource = new MatTableDataSource(this._invoices);

  public _displayedColumns: string[] = [];

  @Input() _pageName:string = '';

  constructor(private _invoiceService: InvoiceDataService,
    private _storage: LocalStorageService, 
    private _snackbar: MatSnackBar,
    private _routerActive:ActivatedRoute,
    private _router:Router) { }

  ngOnInit() {
    this._displayedColumns = this._invoiceService.getFields();
    this._routerActive.paramMap.subscribe(paramMap=>{
      this.getInvoices();
    })
  }
  
  ngAfterContentChecked(): void {
    this._invoiceTableDataSource.data = this._invoices;
  }

  private getInvoices(){
    if (this._pageName === "AllInvoiceList") {
      this._invoices = this._invoiceService.gelAllInvoices();
    }
    if (this._pageName === "TodaysInvoices") {
      this._invoices = this._invoiceService.getTodayInvoices();
    }
  }

  public deleteInvoice(invoiceID: string, index: number) {
    let invoiceIndex:number;
    const invoices= JSON.parse(this._storage.get("InvoiceList"));
    invoiceIndex = invoices.findIndex((invoice: { invoiceID: string; }) => invoice.invoiceID === invoiceID);

    invoices.splice(invoiceIndex, 1);
    this.updateInvoiceData(invoices);
    this._snackbar.open("Invoice Delete Successfully...", 'Ok', { duration: 2000 });
    this._invoiceTableDataSource.data.splice(index, 1);
  }

  public updateInvoiceData(invoices: InvoiceData[]) {
    this._storage.set("InvoiceList", invoices);
  }


  public editInvoice(invoiceID:string){
    this._router.navigateByUrl(`/newInvoice/${invoiceID}`);
  }

}
