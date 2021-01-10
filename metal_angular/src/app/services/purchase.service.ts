import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {VendorResponseData} from './vendor.service';
import {Subject, throwError} from 'rxjs';
import {PurchaseList, PurchaseResponse, SavePurchaseResponse} from '../models/purchase.model';
import {catchError, tap} from 'rxjs/operators';
import {ErrorService} from './error.service';
import {LogLevel, NgxFancyLoggerService} from 'ngx-fancy-logger';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class PurchaseService {
  purchaseList: PurchaseList[] = [];
  purchaseSubject = new Subject<PurchaseList[]>();

  constructor(private http: HttpClient, private errorService: ErrorService, private logger: NgxFancyLoggerService) {
    logger.header('Purchase service Invoked', { color: 'red', fontSize: 20 });
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
    // tslint:disable-next-line:max-line-length
      .pipe(catchError(this.errorService.serverError), tap((response: SavePurchaseResponse) => {
        this.logger.warning('purchase saved', response);
        if (response.success === 1){
              this.purchaseList.unshift(response.data);
              this.purchaseSubject.next([...this.purchaseList]);
          }
      }));

  }
}
