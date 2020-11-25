import { Component, OnInit } from '@angular/core';
import {CashBook} from '../../../models/cash-book.model';
import {HttpClient} from '@angular/common/http';
import {GlobalVariable} from '../../../shared/global';
import {catchError, tap} from 'rxjs/operators';

@Component({
  selector: 'app-cash-book-home',
  templateUrl: './cash-book-home.component.html',
  styleUrls: ['./cash-book-home.component.scss']
})
export class CashBookHomeComponent implements OnInit {
  cashBookList: CashBook[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(GlobalVariable.BASE_API_URL + '/cashBook')
      .subscribe((response: {success: number, data: CashBook[] }) => {
        this.cashBookList = response.data;
      });
  }

}
