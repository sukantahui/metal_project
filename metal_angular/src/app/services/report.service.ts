import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {catchError, tap} from 'rxjs/operators';
import {Ledger} from '../models/ledger.model';
import {of, Subject, throwError} from 'rxjs';
import {TransactionYear} from '../models/transaction-year.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {AuthService} from './auth.service';
export interface Book {
  id: number;
  name: string;
  writer: string;
}

const ALL_BOOKS: Book[] = [
  { id: 101, name: 'Godaan', writer: 'Premchand' },
  { id: 102, name: 'Karmabhoomi', writer: 'Premchand' },
  { id: 103, name: 'Pinjar', writer: 'Amrita Pritam' },
  { id: 104, name: 'Kore Kagaz', writer: 'Amrita Pritam' },
  { id: 105, name: 'Nirmala', writer: 'Premchand' },
  { id: 106, name: 'Seva Sadan', writer: 'Premchand' }
];


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class ReportService {
  transactionYears: TransactionYear[] = [];
  transactionYearSubject = new Subject<TransactionYear[]>();
  reportSearchForm: FormGroup;


  constructor(private http: HttpClient) {
    this.http.get(GlobalVariable.BASE_API_URL + '/transactionYears')
      .pipe(catchError(this.handleError), tap((response: {success: number, data: TransactionYear[]}) => {
        const {data} = response;
        this.transactionYears = data;
        this.transactionYearSubject.next([...this.transactionYears]);
      })).subscribe();

    this.reportSearchForm = new FormGroup({
      search_year: new FormControl(null, [Validators.required]),
      search_month: new FormControl(null)
    });

  }// end of constructor


  getTransactionYears(){
    return [...this.transactionYears];
  }
  getTransactionYearsUpdateListener(){
    return this.transactionYearSubject.asObservable();
  }


  getIncomeGroupTotalListByYearAndMonth(year: number, month: number){
    return this.http.get(GlobalVariable.BASE_API_URL + '/incomeLedgersTotal/' + year + '/' + month )
      .pipe(catchError(this.handleError), tap((response: {success: number, data: any}) => {
          console.log(response);
      }));
  }
  getExpenditureGroupTotalListByYearAndMonth(year: number, month: number){
    return this.http.get(GlobalVariable.BASE_API_URL + '/expenditureLedgersTotal/' + year + '/' + month )
      .pipe(catchError(this.handleError), tap((response: {success: number, data: any}) => {
        console.log(response);
      }));
  }


  private handleError(errorResponse: HttpErrorResponse){
    // when your api server is not working
    if (errorResponse.status === 0){
      alert('your API is not working');
    }
    if (errorResponse.status === 401){
      alert(errorResponse.error.message);
      // this.router.navigate(['auth']).then(r => {});
      // location.reload();
    }

    if (errorResponse.error.message.includes('1062')){
      return throwError({success: 0, status: 'failed', message: 'Record already exists', statusText: ''});
    }else if (errorResponse.error.message.includes('1451')){
      return throwError({success: 0, status: 'failed', message: 'This record can not be deleted', statusText: ''});
    }else {
      return throwError(errorResponse.error.message);
    }
  }

  private serverError(err: any) {
    if (err instanceof Response) {
      return throwError({success: 0, status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    }
    if (err.status === 0){
      // tslint:disable-next-line:label-position
      return throwError ({success: 0, status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
    }
    if (err.status === 401){
      // tslint:disable-next-line:label-position
      return throwError ({success: 0, status: err.status, message: 'Your are not authorised', statusText: err.statusText});
    }
    if (err.status === 500){
      // tslint:disable-next-line:label-position
      return throwError ({success: 0, status: err.status, message: 'Server error', statusText: err.statusText});
    }
    return throwError(err);
  }


  getAllBooks() {
    return of(ALL_BOOKS);
  }
  saveBook(books) {
    console.log(JSON.stringify(books));
  }

}
