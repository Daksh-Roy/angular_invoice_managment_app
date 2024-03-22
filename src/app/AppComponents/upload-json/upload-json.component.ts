import { Component } from '@angular/core';
import { DBData } from '../../Interfaces/dbdata';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../AppServices/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-json',
  templateUrl: './upload-json.component.html',
  styleUrl: './upload-json.component.scss',
})
export class UploadJsonComponent {

  public _fileName:string = '';
  private _fileUploaded: File | null = null;
  private _fileData: DBData = {};

  constructor(private _storage: LocalStorageService, private _snackBar: MatSnackBar, private _routes: Router) {}

  public onFileSelected(event:any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.name !== "jsonDB.json") {
        this._snackBar.open('File Is Not Expected...', '', { duration: 2500 });
        return;
      }
      this._fileName = file.name;
      this._fileUploaded = file;
      const fileReader:FileReader = new FileReader();
      fileReader.readAsText(this._fileUploaded, "JSON");
      fileReader.onload = () => {
        // console.log(fileReader.result?.toString());
        if (fileReader.result?.toString()) {
          this._fileData = JSON.parse(fileReader.result.toString());
          if (this._fileData.products && this._fileData.invoices) {
            this._storage.set("ProductList", this._fileData['products']);
            this._storage.set("InvoiceList", this._fileData['invoices']);
            this._snackBar.open(`${this._fileName} Is Uploaded Successfully...`, '', { duration: 2500 });
          }
          this._routes.navigate(['/home']);
        }

      }
    }
  }

  public deleteAllRecords() {
    this._storage.clear();
    this._snackBar.open('All Records Are Deleted...', '', { duration: 2500 });
  }

  public deleteAllInvoicesRecords() {
    this._storage.remove("InvoiceList");
    if (!this._storage.get("InvoiceList")) {
      this._snackBar.open('All Invoice Reords Are Deleted...', '', { duration: 2500 });
    }
  }

}
