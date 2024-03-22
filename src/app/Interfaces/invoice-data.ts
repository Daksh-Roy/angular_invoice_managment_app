export interface products{
    amount:number;
    productCode:number;
    quantity:number;
    rate:number;
}

export interface InvoiceData {
    date?: string;
    firstName?:string;
    invoiceID?:string;
    lastName?:string;
    middleName?:string;
    paymentMethod?:string;
    total?:number;
    products?:products[];
}
