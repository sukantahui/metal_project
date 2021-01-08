import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GlobalVariable} from '../shared/global';
import {VendorResponseData} from './vendor.service';
import {throwError} from 'rxjs';
import {PurchaseResponse, SavePurchaseResponse} from '../models/purchase.model';
import {catchError, tap} from 'rxjs/operators';
import {ErrorService} from './error.service';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class PurchaseService {
  constructor(private http: HttpClient, private errorService: ErrorService) {

  }

  savePurchase(purchase){
    return this.http.post(GlobalVariable.BASE_API_URL + '/purchases', purchase)
      .pipe(catchError(this.errorService.serverError), tap((response: SavePurchaseResponse) => {

      }));

  }
}
