import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SaleService} from '../../../services/sale.service';
import {SaleBill} from '../../../models/sale.model';

@Component({
  selector: 'app-print-bill',
  templateUrl: './print-bill.component.html',
  styleUrls: ['./print-bill.component.scss']
})
export class PrintBillComponent implements OnInit {
  private sub: Subscription;
  transactionId: number;
  billData: SaleBill;

  constructor(public activatedRoute: ActivatedRoute, private saleService: SaleService) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(response => {
      this.transactionId = response.id;
      // tslint:disable-next-line:no-shadowed-variable
      this.saleService.getSaleForPrint(this.transactionId).subscribe((response: {success: number, data: any}) => {
        this.billData = response.data;
      });
    });
  }

}
