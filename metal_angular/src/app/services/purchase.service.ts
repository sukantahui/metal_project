import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {VendorResponseData} from './vendor.service';
import {Subject, throwError} from 'rxjs';
import {PurchaseList, PurchaseResponse, SavePurchaseResponse} from '../models/purchase.model';
import {catchError, tap} from 'rxjs/operators';
import {ErrorService} from './error.service';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class PurchaseService {
  purchaseList: PurchaseList[] = [];
  purchaseSubject = new Subject<PurchaseList[]>();

  constructor(private http: HttpClient, private errorService: ErrorService) {

    this.http.get(GlobalVariable.BASE_API_URL_DEV + '/purchases')
      .subscribe((response: {success: number, data: PurchaseList[]}) => {
        this.purchaseList = response.data;
        this.purchaseSubject.next([...this.purchaseList]);
      });
  }
  getPurchaseList(){
    return [...this.purchaseList];
  }
  getPurchaseListServiceListener(){
    return this.purchaseSubject.asObservable();
  }

  savePurchase(purchase){
    return this.http.post(GlobalVariable.BASE_API_URL + '/purchases', purchase)
      .pipe(catchError(this.errorService.serverError), tap((response: SavePurchaseResponse) => {
          console.log(response);
          if (response.success === 1){
              this.purchaseList.unshift(response.data);
              this.purchaseSubject.next([...this.purchaseList]);
          }
      }));

  }
}
