import { Component, OnInit } from '@angular/core';
import {ReceiveService} from '../../services/receive.service';
import {Ledger} from '../../models/ledger.model';
import {AssetService} from '../../services/asset.service';
import {Asset} from '../../models/asset.model';
import {FormGroup} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {formatDate} from '@angular/common';
import Swal from 'sweetalert2';
import {Transaction} from '../../models/transaction.model';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {
  incomeLedgers: Ledger[] = [];
  assets: Asset[] = [];
  incomeTransactions: Transaction[] = [];

  transactionForm: FormGroup
  searchTerm: any;
  pageSize = 10;
  p = 1;

  constructor(private receiveService: ReceiveService, private asstService: AssetService) { }

  ngOnInit(): void {
  // incomeLedgers
  this.incomeLedgers = this.receiveService.getIncomeLedgers();
  this.receiveService.getIncomeLedgersUpdateListener().subscribe((data: Ledger[]) => {
      this.incomeLedgers = data;
    } );

  // incomeTransactions
  this.incomeTransactions = this.receiveService.getIncomeTransactions();
  this.receiveService.getIncomeTransactionUpdateListener().subscribe((data: Transaction[]) => {
    this.incomeTransactions = data;
  });

    // assets
  this.assets = this.asstService.getAssets();
  this.asstService.getAssetsUpdateListener().subscribe((data: Asset[]) => {
      this.assets = data;
    });

    // setting form
  this.transactionForm = this.receiveService.transactionForm;
  this.transactionForm.patchValue({asset_id: 1});
  }

  handleTransactionDateChange($event: MatDatepickerInputEvent<unknown>) {
    let val = this.transactionForm.value.transaction_date;
    val = formatDate(val, 'yyyy-MM-dd', 'en');
    this.transactionForm.patchValue({transaction_date: val});
  }

  saveIncomeTransaction() {

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
        this.receiveService.saveIncomeTransaction(this.transactionForm.value).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Sale saved',
              showConfirmButton: false,
              timer: 3000
            }).then(r => {
              this.transactionForm.patchValue({ledger_id: null, asset_id: 1, amount: 0, particulars: null});
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
