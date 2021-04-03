import { Injectable } from '@angular/core';
import {GlobalVariable} from '../shared/global';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ErrorService} from './error.service';
import {NgxFancyLoggerService} from 'ngx-fancy-logger';
import {SaleItem, SaleResponse} from '../models/sale.model';
import {Subject} from 'rxjs';
import {PurchaseList} from '../models/purchase.model';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class SaleService {
  private saleList: SaleItem[] = [];
  saleSubject = new Subject<SaleItem[]>();

  constructor(private http: HttpClient, private errorService: ErrorService, private logger: NgxFancyLoggerService) {
    this.http.get(GlobalVariable.BASE_API_URL_DEV + '/sales')
      .subscribe((response: {success: number, data: SaleItem[]}) => {
        this.saleList = response.data;
        this.saleSubject.next([...this.saleList]);
      });
  }
  getSaleList(){
    return [...this.saleList];
  }
  getSaleListListener(){
    return this.saleSubject.asObservable();
  }

  saveSale(saleData){
    return this.http.post(GlobalVariable.BASE_API_URL + '/dev/sales', saleData)
      // tslint:disable-next-line:max-line-length
      .pipe(catchError(this.errorService.serverError), tap((response: SaleResponse) => {
        this.logger.warning('Sale saved', response);
        if (response.success === 1){
          this.saleList.unshift(response.data);
          this.saleSubject.next([...this.saleList]);
        }
      }));
  }
  getSaleForPrint(id: number){
    return this.http.get(GlobalVariable.BASE_API_URL_DEV + '/salesPrint/' + id);
  }
}
