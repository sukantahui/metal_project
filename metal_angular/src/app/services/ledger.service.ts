import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalVariable} from '../shared/global';
import {catchError, delay, tap} from 'rxjs/operators';
import {Ledger} from '../models/ledger.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, Subject, throwError} from 'rxjs';
import {Person} from './data.service';
// import {Transaction} from "../models/transaction.model";


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class LedgerService {
  ledgerForm: FormGroup;
  incomeLedgers: Ledger[] = [];
  incomeLedgerSubject = new Subject<Ledger[]>();
  expenditureLedgers: Ledger[] = [];
  expenditureLedgerSubject = new Subject<Ledger[]>();

  constructor(private http: HttpClient) {

    this.http.get(GlobalVariable.BASE_API_URL + '/incomeLedgers')
      .pipe(catchError(this.handleError), tap((response: {success: number, data: Ledger[]}) => {
        const {data} = response;
        this.incomeLedgers = data;
        this.incomeLedgerSubject.next([...this.incomeLedgers]);
      })).subscribe();

    this.http.get(GlobalVariable.BASE_API_URL + '/expenditureLedgers')
      .pipe(catchError(this.handleError), tap((response: {success: number, data: Ledger[]}) => {
        const {data} = response;
        this.expenditureLedgers = data;
        this.expenditureLedgerSubject.next([...this.expenditureLedgers]);
      })).subscribe();

    this.ledgerForm = new FormGroup({
      id: new FormControl(null, ),
      ledger_type_id: new FormControl(null, [Validators.required]),
      ledger_name: new FormControl(null, [Validators.required])
    });
  } // end of constructor
  // testing
  getExpLedgers(term: string = null): Observable<Ledger[]> {
    let items = this.expenditureLedgers;
    console.log(items);
    if (term) {
      items = items.filter(x => x.ledger_name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }

  getIncomeLedgersUpdateListener(){
    return this.incomeLedgerSubject.asObservable();
  }

  getIncomeLedgers(){
    return [...this.incomeLedgers];
  }

  getExpenditureLedgersUpdateListener(){
    return this.expenditureLedgerSubject.asObservable();
  }

  getExpenditureLedgers(){
    return [...this.expenditureLedgers];
  }

  saveLedger(ledgerData) {
    // tslint:disable-next-line:max-line-length
    return this.http.post<{success: number, data: Ledger}>(GlobalVariable.BASE_API_URL + '/ledgers', ledgerData)
      .pipe(catchError(this.handleError), tap((response: {success: number, data: Ledger}) => {
        if ( response.data.ledger_type_id === 1) {
          this.incomeLedgers.unshift( response.data);
          this.incomeLedgerSubject.next([...this.incomeLedgers]);
        }else{
          this.expenditureLedgers.unshift( response.data);
          this.expenditureLedgerSubject.next([...this.expenditureLedgers]);
        }
      }));
  }

  private handleError(errorResponse: HttpErrorResponse){
    // when your api server is not working
    if (errorResponse.status === 0){
      alert('your API is not working');
    }
    if (errorResponse.status === 401){
      alert(errorResponse.error.message);
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
    console.log('sever error:', err);  // debug
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
}
