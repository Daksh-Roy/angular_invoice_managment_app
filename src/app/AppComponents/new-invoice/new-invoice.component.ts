import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from '../../AppServices/local-storage.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductData } from '../../Interfaces/product-data';
import { InvoiceData, products } from '../../Interfaces/invoice-data';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrl: './new-invoice.component.scss'
})
export class NewInvoiceComponent implements OnInit {

  public _invoiceForm!: FormGroup;
  public _invoiceTable!: FormGroup;

  public _allPRoducts: number[] = [];
  public _availableProduct:number[]=[];
  private _productList: ProductData[] = [];
  public _totalAmount: number = 0;
  public _hideTableHeader=true;

  private _editInvoiceID: string | null = null;
  private _editInvoiceIndex:number|null=null;

  @ViewChild(FormGroupDirective) private formDir!: FormGroupDirective;

  constructor(
    private _storage: LocalStorageService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) {}

  ngOnInit(): void {
    this._productList = JSON.parse(this._storage.get("ProductList"));

    this._invoiceTable = this._formBuilder.group({
      products: this._formBuilder.array([])
    })

    this._invoiceForm = this._formBuilder.group({
      'firstNameControl': new FormControl('', Validators.required),
      'middleNameControl': new FormControl('', Validators.required),
      'lastNameControl': new FormControl('', Validators.required),
      'dateControl': new FormControl(new Date().toISOString().split('T')[0]),
      'paymentControl': new FormControl('', Validators.required),
      'invoiceTable': new FormGroup(this._invoiceTable.controls),
      'totalAmountControl': new FormControl('')
    })

    this.getAvialableProduct();
    this.getLockedProduct();

    this._editInvoiceID = this._activatedRoute.snapshot.paramMap.get('invoiceID');
    if (this._editInvoiceID) {
      this.fetchInvoiceData(this._editInvoiceID);
    }
    
  }

  private getAvialableProduct() {
    if(this._productList!==null){
      for (let product of this._productList) {
        this._allPRoducts.push(product.productCode);
      }
    }

  }
  private getLockedProduct() {
    if(this._productList!==null){
      for (let product of this._productList) {
        if (product.lock === false) {
          this._availableProduct.push(product.productCode);
        }
      }
    }
  }
  
  get table() {
    return this._invoiceTable.get('products') as FormArray;
  }

  public addRow() {
    this._hideTableHeader=false;

    const tableRow = this._formBuilder.group({
      productCode: this._formBuilder.control('', Validators.required),
      description: this._formBuilder.control({ value: '', disabled: true }),
      quantity: this._formBuilder.control({ value: '', disabled: true }, [Validators.required, Validators.min(1)]),
      rate: this._formBuilder.control({ value: '', disabled: true }, [Validators.required, Validators.min(1)]),
      amount: this._formBuilder.control({ value: '', disabled: true }, [Validators.required])
    })
    this.table.push(tableRow);
  }

  public changeProductCode(value: string, index: number) {
    for (let product of this._productList) {
      if (product.productCode === parseInt(value)) {

        const rows = this.table as FormArray;
        rows.controls[index].get('description')?.enable();
        rows.controls[index].get('quantity')?.enable();
        rows.controls[index].get('rate')?.enable();
        rows.controls[index].get('amount')?.enable();

        rows.controls[index].get('description')?.setValue(product.description)
        rows.controls[index].get('rate')?.setValue(product.rate)
      }
    }
  }

  public changeQuantity(quantity: string, index: number) {
    const rows:FormArray = this.table;
    if (rows.controls[index].get('quantity')?.valid) {
      const rate = rows.controls[index].get('rate')?.value;
      rows.controls[index].get('amount')?.setValue(rate * parseInt(quantity))
      this.calculateTotalAmount();
      //this.calculateTotalAmount(rate*parseInt(quantity))
    } else {
      rows.controls[index].get('amount')?.setValue(null)
    }
  }

  public changeRate(rate: string, index: number) {
    const rows:FormArray = this.table;
    if (rows.controls[index].get('rate')?.valid) {
      rows.controls[index].get('quantity')?.setValue(null);
      const selectedProduct = rows.controls[index].get('productCode')?.value;
      let minimumrate: number = 0;
      for (let product of this._productList) {
        if (product.productCode === parseInt(selectedProduct)) {
          minimumrate = product.minimumRate;
        }
      }
      if (minimumrate > parseInt(rate)) {
        this._snackBar.open(`${minimumrate} is required`, '', { duration: 2500 });
        rows.controls[index].get('rate')?.setValue(minimumrate);
      }
    } else {
      rows.controls[index].get('amount')?.setValue(null)
    }
  }

  private calculateTotalAmount() {
    const rows:FormArray = this.table;
    this._totalAmount = 0;
    for (let product of rows.value) {
      if (Number.isNaN(product.amount) || product.amount === undefined) {
        continue;
      }
      this._totalAmount += product.amount;
    }
    const totalAmount:FormControl = this._invoiceForm.get('totalAmountControl') as FormControl;
    totalAmount.setValue(this._totalAmount);
  }

  

  public submit() {
    if (!this.validateControls()) {
      return;
    } else {
      this.getInvoiceData();
    }
  }

  public deleteRow(index: number) {
    const rows:FormArray = this.table;
    rows.removeAt(index);
    this.calculateTotalAmount();
  }

  private validateControls(): boolean {
    if (this._invoiceForm.status === "INVALID") {
      const controls = this._invoiceForm.controls;
      for (let controlName of Object.keys(controls)) {
        this.displayMessage(controlName);
      }
      return false;
    }
    else if (this.table.value.length === 0) {
      this._snackBar.open("Add at least one Product", 'Ok', { duration: 2000 });
      return false;
    } else {
      return true;
    }
  }

  private displayMessage(controlName: string) {
    const name = controlName.split('C')[0];
    if (this._invoiceForm.controls[controlName].status === "INVALID") {
      this._snackBar.open(`please Enter valid ${name}`, '', { duration: 2000 });
      return;
    }
  }

  private getInvoiceData() {
    let invoice: InvoiceData = {}
    let invoices = JSON.parse(this._storage.get("InvoiceList"));

    if (this._editInvoiceID !== null) {
      invoice.invoiceID = this._editInvoiceID;
    } else {
      if(invoices!==null){
        invoice.invoiceID = 'inv' + (invoices.length + 1);
      }else{
        invoice.invoiceID='inv1';
      }
    }

    invoice.firstName = this._invoiceForm.get('firstNameControl')?.value;
    invoice.middleName = this._invoiceForm.get('middleNameControl')?.value;
    invoice.lastName = this._invoiceForm.get('lastNameControl')?.value;
    invoice.date = this._invoiceForm.get('dateControl')?.value;
    invoice.paymentMethod = this._invoiceForm.get('paymentControl')?.value;
    invoice.total = this._totalAmount

    const productData:products[] = this.table.value;
    let productArray:products[] = [];
    for (let product of productData) {
      const rowData:products = {
        productCode: product['productCode'],
        quantity: product['quantity'],
        rate: product['rate'],
        amount: product['amount'],
      }
      productArray.push(rowData);
    }
    invoice.products = productArray;

    if (this._editInvoiceID !== null) {
      invoices.splice(this._editInvoiceIndex,1,invoice);
    } else {
      if(invoices!==null){
        invoices.push(invoice);
      }else{
        invoices=[invoice]
      }
    }
    
    this.storeInvoice(invoices);
  }

  private storeInvoice(invoices: InvoiceData[]) {
    this._storage.set("InvoiceList",invoices);
    this._snackBar.open('Invoice Added Succussesfully..', 'OK', { duration: 2000 });
    this.formDir.resetForm();
    const rows:FormArray = this.table;
    rows.clear();
  }

  //edit Invoice
  private fetchInvoiceData(editInvoiceID: string) {
    const invoiceList: InvoiceData[] = JSON.parse(this._storage.get("InvoiceList"));
    let invoiceData: InvoiceData | null = null;
    for (let invoice of invoiceList) {
      if (invoice.invoiceID === editInvoiceID) {
        invoiceData = invoice;
        this._editInvoiceIndex=invoiceList.indexOf(invoice);
      }
    }
    if (invoiceData === null) {
      this._router.navigateByUrl('**');
    } else {
      this.setInvoiceDataIntoForm(invoiceData);
    }
  }

  private setInvoiceDataIntoForm(invoiceData: InvoiceData) {
    this._invoiceForm.get('firstNameControl')?.setValue(invoiceData.firstName);
    this._invoiceForm.get('middleNameControl')?.setValue(invoiceData.middleName);
    this._invoiceForm.get('lastNameControl')?.setValue(invoiceData.lastName);
    this._invoiceForm.get('dateControl')?.setValue(invoiceData.date);
    this._invoiceForm.get('paymentControl')?.setValue(invoiceData.paymentMethod);
    this._invoiceForm.get('totalAmountControl')?.setValue(invoiceData.total);
    console.log(invoiceData.total);
    
    this._totalAmount=invoiceData.total||0;
    const rows = this.table;

    for (let index in invoiceData.products) {
      let productIndex = parseInt(index);
      let productData = invoiceData.products[productIndex];
      this.addRow();
      rows.controls[productIndex].get('productCode')?.setValue(productData.productCode);

      this.changeProductCode(productData.productCode.toString(), productIndex)
      rows.controls[productIndex].get('quantity')?.setValue(productData.quantity);
      rows.controls[productIndex].get('rate')?.setValue(productData.rate);
      rows.controls[productIndex].get('amount')?.setValue(productData.amount);
    }
  }


}
