import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Asset} from '../models/asset.model';
import {Subject, throwError} from 'rxjs';
import {GlobalVariable} from '../shared/global';
import {catchError, tap} from 'rxjs/operators';
import {Ledger} from '../models/ledger.model';


@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class AssetService {
  assets: Asset[] = [];
  assetsSubject = new Subject<Asset[]>();
  constructor(private http: HttpClient, private router: Router) {
    this.http.get(GlobalVariable.BASE_API_URL + '/assets')
      .pipe(catchError(this.handleError), tap((response: {success: number, data: Asset[]}) => {
        const {data} = response;
        this.assets = data;
        this.assetsSubject.next([...this.assets]);
      })).subscribe();
  }

  getAssetsUpdateListener(){
    return this.assetsSubject.asObservable();
  }

  getAssets(){
    return [...this.assets];
  }


  private handleError(errorResponse: HttpErrorResponse){
    // when your api server is not working
    if (errorResponse.status === 0){
      alert('your API is not working');
    }
    if (errorResponse.status === 401){
      alert(errorResponse.error.message);
      // this.router.navigate(['/auth']).then();
      this.router.navigate(['/owner']).then(r => {console.log(r); });
      location.reload();
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
