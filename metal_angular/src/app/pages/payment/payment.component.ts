import { Component, OnInit } from '@angular/core';
import {Ledger} from '../../models/ledger.model';
import {PaymentService} from '../../services/payment.service';
import {FormGroup} from '@angular/forms';
import {Asset} from '../../models/asset.model';
import {Transaction} from '../../models/transaction.model';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {formatDate} from '@angular/common';
import Swal from 'sweetalert2';
import {AssetService} from '../../services/asset.service';
import {Observable} from 'rxjs';
import {DataService, Person} from '../../services/data.service';
import {LedgerService} from '../../services/ledger.service';
import {HttpClient} from '@angular/common/http';
import {GlobalVariable} from '../../shared/global';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  expenditureLedgers: Ledger[] = [];
  assets: Asset[] = [];
  expenditureTransactions: Transaction[] = [];

  transactionForm: FormGroup;
  searchTerm: any;
  pageSize = 10;
  p = 1;

  people$: Observable<Person[]>;
  expLedgers$: Observable<Ledger[]>;
  selectedPersonId = '5a15b13c36e7a7f00cf0d7cb';
  expenditureID = '';
  data = [];

  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, private paymentService: PaymentService, private ledgerService: LedgerService, private asstService: AssetService, private dataService: DataService) {
    this.http.get(GlobalVariable.BASE_API_URL + '/expenditureLedgers').subscribe((response: {success: number, data: any[]}) => {
      // this.data.push(response.data);
      this.data = response.data;
      console.log(this.data);
    }, error => console.error(error));
  }

  ngOnInit(): void {
    this.people$ = this.dataService.getPeople();
    this.expLedgers$ = this.ledgerService.getExpLedgers();
    this.expenditureLedgers = this.paymentService.getExpenditureLedgers();
    this.paymentService.getExpenditureLedgersUpdateListener().subscribe(data => {
      this.expenditureLedgers = data;
    });
    this.transactionForm = this.paymentService.transactionForm;

    // assets
    this.assets = this.asstService.getAssets();
    this.asstService.getAssetsUpdateListener().subscribe((data: Asset[]) => {
      this.assets = data;
    });

    this.paymentService.expenditureTransactionSubject.subscribe(data => {
      this.expenditureTransactions = data;
    });
    this.expenditureTransactions = this.paymentService.getTransactionDetails();

  } // end of ngonit

  handleTransactionDateChange($event: MatDatepickerInputEvent<unknown>) {
    let val = this.transactionForm.value.transaction_date;
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.transactionForm.patchValue({transaction_date: val});
  }

  saveExpenditureTransaction() {

    Swal.fire({
      title: 'Confirmation',
      text: 'Do you sure to Save',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save It!'
    }).then((result) => {
      // if selected yes
      if (result.value) {
        // will be saved from here

        // tslint:disable-next-line:max-line-length
        this.paymentService.saveExpenditureTransaction(this.transactionForm.value).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Expenditure saved',
              showConfirmButton: false,
              timer: 1000
            }).then(r => {
              this.transactionForm.patchValue({ledger_id: null, asset_id: 1, amount: 0, particulars: null, voucher_number: null});
            });
          }
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
            footer: '<a href>Why do I have this issue?</a>',
            timer: 0
          });
        });
      }else{
        // will not be saved
      }
    });
  }

  clearTransactionForm() {
    const now = new Date();
    const val = formatDate(now, 'yyyy-MM-dd', 'en');
    this.transactionForm.patchValue({transaction_date: val, ledger_id: null, asset_id: 1, amount: 0, particulars: null});
  }

}
