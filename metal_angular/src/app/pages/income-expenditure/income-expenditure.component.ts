import { Component, OnInit } from '@angular/core';
import {ReportService} from '../../services/report.service';
import {TransactionYear} from '../../models/transaction-year.model';
import {FormGroup} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select';
export interface TransactionMonth {
  month_number: number;
  month_name: string;
}

@Component({
  selector: 'app-income-expenditure',
  templateUrl: './income-expenditure.component.html',
  styleUrls: ['./income-expenditure.component.scss']
})
export class IncomeExpenditureComponent implements OnInit {

  transactionYears: TransactionYear[] = [];
  transactionMonths: TransactionMonth[] = [];
  reportSearchForm: FormGroup;
  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.transactionYears = this.reportService.getTransactionYears();
    this.reportService.getTransactionYearsUpdateListener().subscribe((data: TransactionYear[]) => {
      this.transactionYears = data;
    });

    this.reportSearchForm = this.reportService.reportSearchForm;


  }// end of ngOnIt

  selectMonthByYear($event: MatSelectChange) {
    const index = this.transactionYears.findIndex(x => x.transaction_year === $event.value);
    this.transactionMonths = this.transactionYears[index].months;
  }
}
