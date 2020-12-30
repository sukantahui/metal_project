import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {VendorService} from '../../services/vendor.service';
import {Vendor} from '../../models/vendor.model';
import Swal from 'sweetalert2';
import { faUserEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import * as deepEqual from 'fast-deep-equal';

export interface State {
  id: number;
  state_name: string;
  state_code: number;
}

export interface TransactionType {
  id: number;
  transaction_name: string;
  formal_name: string;
  transaction_type_value: number;
}


@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  vendorForm: FormGroup;
  states: State[] = [];
  transactionTypes: TransactionType[] = [];
  vendors: Vendor[] = [];
  validatorError: any = null;
  updateableVendorID = 0;

  page: number;
  pageSize = 15;
  p = 1;
  currentPage = 1;
  searchTerm: any;

  faUserEdit = faUserEdit;
  faTrashAlt = faTrashAlt;
  defaultVendorFormValue: any;
  constructor(private http: HttpClient, private vendorService: VendorService) {
    this.vendorForm = new FormGroup({
      id: new FormControl(null),
      ledger_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      billing_name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      customer_category_id: new FormControl(1),
      email: new FormControl(null),
      mobile1: new FormControl(null),
      mobile2: new FormControl(null),
      address1: new FormControl(null),
      address2: new FormControl(null),
      state_id: new FormControl(20),
      po: new FormControl(null),
      area: new FormControl(null),
      city: new FormControl(null),
      pin: new FormControl(null),
      an: new FormControl(2,[Validators.required]),
      opening_balance: new FormControl(0),

    });
  }

  ngOnInit(): void {

    this.http.get('http://127.0.0.1:8000/api/dev/states').subscribe((response: {success: number, data: State[]}) => {
      this.states = response.data;
    });
    this.http.get('http://127.0.0.1:8000/api/dev/transactionTypes').subscribe((response: {success: number, data: TransactionType[]}) => {
      this.transactionTypes = response.data;
    });

    this.vendorService.getVendorServiceListener().subscribe(response => {
      this.vendors = response;
    });
    this.vendors = this.vendorService.getVendors();

  }

  onSubmit() {
    this.validatorError = null;
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to add this vendor',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
      if (result.isConfirmed){
        this.vendorService.saveVendor(this.vendorForm.value).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Vendor saved',
              showConfirmButton: false,
              timer: 1000
            });
          }else{
            this.validatorError = response.error;
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Validation error',
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      }
    });
  }

  populateVendorForm(vendor: Vendor) {
    this.vendorForm.patchValue(vendor);
  }

  onUpdate() {
    this.validatorError = null;
    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to update this vendor',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
      if (result.isConfirmed){
        this.vendorService.updateVendor(this.vendorForm.value).subscribe(response => {
          if (response.success === 1){
            this.updateableVendorID = 0;
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Customer updated',
              showConfirmButton: false,
              timer: 1000
            });
          }else{
            this.validatorError = response.error;
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Validation error',
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      }
    });
  }

  deleteVendor(vendorId) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure to delete this vendor',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create It!'
    }).then((result) => {
      if (result.isConfirmed){
        this.vendorService.deleteVendor(vendorId)
          .subscribe(response  => {
            if (response.success){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Vendor deleted',
                showConfirmButton: false,
                timer: 1000
              });
            }

          }, (error) => {
            // when error occured
            console.log(error);
          });
      }
    });
  }
  clearVendorForm() {
    this.vendorForm.reset();
    // this.vendorForm.patchValue({customer_category_id: 2, state_id: 20, transaction_type_id: 1, opening_balance: 0});
    this.validatorError = null;
    this.updateableVendorID = 0;
  }

  isVendorFormEmpty() {
    return deepEqual(this.defaultVendorFormValue, this.vendorForm.value);

  }
}
