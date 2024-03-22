import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  _todayDate:string|null=null;
  _date:Date|null=null;

  ngOnInit(): void {
    this._date=new Date();
    this._todayDate=this._date.getDate()+" / "+this._date.getMonth()+" / "+this._date.getFullYear();
  }

}
