import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formateAmount'
})
export class FormateAmountPipe implements PipeTransform {

  transform(value: number) {
    return '₹ '+Number(value).toLocaleString('en-IN');
  }

}
