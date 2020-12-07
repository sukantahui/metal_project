import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { GlobalVariable } from '../shared/global';

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class CustomerService {

  constructor(private http: HttpClient) {
    this.http.get(GlobalVariable.BASE_API_URL + '/customers').subscribe();
  }
}
