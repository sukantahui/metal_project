import { Injectable } from '@angular/core';
import {GlobalVariable} from '../shared/global';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ErrorService} from './error.service';
import {NgxFancyLoggerService} from 'ngx-fancy-logger';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class SaleService {

  constructor(private http: HttpClient, private errorService: ErrorService, private logger: NgxFancyLoggerService) { }
  saveSale(saleData){
    return this.http.post(GlobalVariable.BASE_API_URL + '/sales', saleData)
      // tslint:disable-next-line:max-line-length
      .pipe(catchError(this.errorService.serverError), tap((response: any) => {
        this.logger.warning('Sale saved', response);
        if (response.success === 1){
          // this.saleList.unshift(response.data);
          // this.purchaseSubject.next([...this.purchaseList]);
        }
      }));
  }
}
