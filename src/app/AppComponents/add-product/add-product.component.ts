import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductData } from '../../Interfaces/product-data';
import { LocalStorageService } from '../../AppServices/local-storage.service';
import { FormBuilder, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProductComponent } from '../UtilityComponent/update-product/update-product.component';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit, AfterContentChecked {

  public _products: ProductData[] = [];
  public _productTableDataSource:any = new MatTableDataSource(this._products);
  public _displayedColumns: string[] = ['No', 'Product Code', 'Description', 'Rate', 'Minimum Rate', 'Lock', 'Update', 'Delete'];

  @ViewChild(FormGroupDirective) private formDir!: FormGroupDirective;

  constructor(
    private _storage: LocalStorageService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog) { }

  public _productForm = this._formBuilder.group({
    productCodeControl: new FormControl('', Validators.required),
    descriptionControl: new FormControl('', Validators.required),
    rateControl: new FormControl('',[Validators.required, Validators.min(1)]),
    minimumRateControl: new FormControl('',[Validators.required, Validators.min(1)]),
    lockControl: new FormControl(false),
  })

  ngOnInit(): void {
    this._products = JSON.parse(this._storage.get("ProductList"));
  }
  ngAfterContentChecked(): void {
    this._productTableDataSource.data = this._products;
  }

  private getProductCode() {
    const productCode = this._productForm.value.productCodeControl;
    if (productCode !== undefined && productCode !== null) {
      return productCode;
    } else {
      return '';
    }
  }
  private getDescription() {
    const description = this._productForm.value.descriptionControl;
    if (description !== undefined && description !== null) {
      return description;
    } else {
      return '';
    }
  }
  private getRate() {
    const rate = this._productForm.value.rateControl;
    if (rate !== undefined && rate !== null) {
      return rate;
    } else {
      return '';
    }
  }
  private getMinimumRate() {
    const minimumRate = this._productForm.value.minimumRateControl;
    if (minimumRate !== undefined && minimumRate !== null) {
      return minimumRate;
    } else {
      return '';
    }
  }
  private getLock() {
    const lock = this._productForm.value.lockControl;
    if (lock !== undefined && lock !== null) {
      return lock;
    } else {
      return false;
    }
  }

  public addProduct() {
    let productId: number = 0;
    if (this._products !== null) {
      productId = this._products.length + 1;
    } else {
      productId = 1;
    }
    const productCode: number = parseInt(this.getProductCode());
    const description: string = this.getDescription();
    const rate: number = parseInt(this.getRate());
    const minimumRate: number = parseInt(this.getMinimumRate());
    const lock: boolean = this.getLock();

    if (!this.validateControls()) {
      return;
    }
    if (!this.validateProductCode(productCode)) {
      this._snackBar.open('Please Enter Unique Product Code...', 'OK', { duration: 2500 });
      return;
    }
    if (!this.validateRateAndMinimumRat(rate, minimumRate)) {
      this._snackBar.open('Rate Should be Greater then Minimum Rate...', 'OK', { duration: 2500 });
      return;
    }

    const product: ProductData = {
      id: productId,
      productCode: productCode,
      description: description,
      rate: rate,
      minimumRate: minimumRate,
      lock: lock
    }

    if (this._products !== null) {
      this._products.push(product);
    }else{
      this._products=[product];
    }
    this.updateProductData(this._products, "Product Added Successfully...");
    this.resetForm();
  }


  private validateProductCode(inputedProductCode: number): boolean {
    if (this._products !== null) {
      for (let product of this._products) {
        if (inputedProductCode === product.productCode) {
          return false;
        }
      }
    }
    return true;
  }

  private validateRateAndMinimumRat(rate: number, minimumRate: number): boolean {
    if (rate < minimumRate) {
      return false;
    }
    return true;
  }

  private validateDeleteProduct(productIndex: number) {
    const product = this._products[productIndex];
    const invoices = JSON.parse(this._storage.get("InvoiceList"));
    if(invoices!==null){
      for (let invoice of invoices) {
        for (let buyedProducts of invoice.products) {
          if (product.productCode === buyedProducts.productCode) {
            const message = "Product is available in " + invoice.firstName + " " + invoice.lastName + "'s Invoice ";
            this._snackBar.open(message, 'OK', { duration: 2500 });
            return false;
          }
        }
      }
    }
    return true;
  }
  private validateControls(): boolean {
    if (this._productForm.status === 'INVALID') {
      this.displayMessage();
      return false;
    } else {
      return true;
    }

  }
  private displayMessage() {
    if (this._productForm.controls.productCodeControl.status === 'INVALID') {
      this._snackBar.open("please Enter Product Code", '', { duration: 2000 });
      return;
    }
    if (this._productForm.controls.descriptionControl.status === 'INVALID') {
      this._snackBar.open("please Enter Description", '', { duration: 2000 });
      return;
    }
    if (this._productForm.controls.rateControl.status === 'INVALID') {
      this._snackBar.open("please Enter Rate", '', { duration: 2000 });
      return;
    }
    if (this._productForm.controls.minimumRateControl.status === 'INVALID') {
      this._snackBar.open("please Enter MiniMumRate", '', { duration: 2000 });
      return;
    }
  }


  public deleteProduct(productIndex: number) {
    if (this.validateDeleteProduct(productIndex)) {
      this._products.splice(productIndex, 1);
      this.updateProductData(this._products, "Product Deleted Successfully...")
    }
  }

  public openDialogUpdateProduct(productData: ProductData) {
    let updatedData = this._dialog.open(UpdateProductComponent, {
      width: '50%',
      data: {
        id: productData.id,
        productCode: productData.productCode,
        description: productData.description,
        rate: productData.rate,
        minimumRate: productData.minimumRate,
        lock: productData.lock
      }
    });
    updatedData.afterClosed().subscribe(data => {
      this.updateProduct(data);
    })
  }

  private updateProduct(productData: any) {
    let updateIndex: number | null = null;
    const updatedData: ProductData = {
      id: parseInt(productData.productId),
      description: productData.descriptionControl,
      lock: productData.lockControl,
      minimumRate: parseInt(productData.minimumRateControl),
      productCode: parseInt(productData.productCodeControl),
      rate: parseInt(productData.rateControl)
    };

    if(updatedData.description===''){
      this._snackBar.open('Please Enter Description...', 'OK', { duration: 2500 });
      return;
    }
    
    if (!this.validateRateAndMinimumRat(updatedData.rate, updatedData.minimumRate)) {
      this._snackBar.open('Rate Should be Greater then Minimum Rate...', 'OK', { duration: 2500 });
      return;
    }

    for (let product of this._products) {
      if (product.id === updatedData.id) {
        updateIndex = this._products.indexOf(product);
      }
    }

    if (updateIndex !== null) {
      this._products.splice(updateIndex, 1, updatedData);
      this.updateProductData(this._products, "Product Updated Successfully...");
    }
  }


  private updateProductData(productData: ProductData[], message: string) {
    this._storage.set("ProductList", productData);
    this._snackBar.open(message, '', { duration: 2000 });
  }

  private resetForm() {
    this.formDir.resetForm();
  }


}
