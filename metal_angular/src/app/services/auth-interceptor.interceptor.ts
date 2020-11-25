import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpParams, HttpErrorResponse
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {take, exhaustMap, catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  userData: {id: number, personName: string, _authKey: string, personTypeId: number};
  constructor(private authService: AuthService, private router: Router) {
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    // handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      // navigate /delete cookies or whatever
      // this.router.navigateByUrl('/auth');
      this.authService.logout();
      // localStorage.removeItem('user');
      // this.router.navigate(['/auth']);

      // tslint:disable-next-line:max-line-length
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError(err);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if (localStorage.getItem('user')){
      this.userData = JSON.parse(localStorage.getItem('user'));
    }else{
      this.userData = {id: 0, personName: 'No Person', _authKey: 'no key', personTypeId: 0};
    }

    console.log('intercepted request ... ');

    // Clone the request to add the new header.
    const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.userData._authKey) });

    console.log('Sending request with new header now ...');

    // send the newly created request
    return next.handle(authReq).pipe(catchError(x => this.handleAuthError(x)));
  }

}
