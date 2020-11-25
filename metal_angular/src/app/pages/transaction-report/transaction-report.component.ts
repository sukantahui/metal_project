import { Component, OnInit } from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import {Transaction} from '../../models/transaction.model';
import {ReceiveService} from "../../services/receive.service";

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.scss']
})
export class TransactionReportComponent implements OnInit {
  expenditureTransactions: Transaction[] = [];
  incomeTransactions: Transaction[] = [];
  searchTerm: any;
  pageSize = 10;
  p = 1;
  constructor(private paymentService: PaymentService, private receiveService: ReceiveService) { }

  ngOnInit(): void {
    this.expenditureTransactions = this.paymentService.getTransactionDetails();
    this.paymentService.getTransactionsUpdateListener().subscribe(data => {
      this.expenditureTransactions = data;
    });

    this.incomeTransactions = this.receiveService.getIncomeTransactions();
    this.receiveService.getIncomeTransactionUpdateListener().subscribe(data => {
      this.incomeTransactions = data;
    });

  }

}
