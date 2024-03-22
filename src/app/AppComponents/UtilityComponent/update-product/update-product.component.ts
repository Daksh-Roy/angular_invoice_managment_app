import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductData } from '../../../Interfaces/product-data';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit {

  private _productData!: ProductData;


  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: ProductData,
    private _matDialogRef: MatDialogRef<UpdateProductComponent>,
    private _formBuilder: FormBuilder) { }

  _productUpdateForm = this._formBuilder.group({
    productId:this._formBuilder.control(''),
    productCodeControl: this._formBuilder.control(''),
    descriptionControl: this._formBuilder.control(''),
    rateControl: this._formBuilder.control(''),
    minimumRateControl: this._formBuilder.control(''),
    lockControl: this._formBuilder.control(false),
  })

  ngOnInit(): void {
    this._productData = this._data;
    this._productUpdateForm.patchValue({
      productId:this._productData.id.toString(),
      productCodeControl: this._productData.productCode.toString(),
      descriptionControl: this._productData.description ,
      rateControl: this._productData.rate.toString(),
      minimumRateControl: this._productData.minimumRate.toString(),
      lockControl: this._productData.lock,
    })
  }

  public updateProduct(){
    this._matDialogRef.close(this._productUpdateForm.value);
  }

}
