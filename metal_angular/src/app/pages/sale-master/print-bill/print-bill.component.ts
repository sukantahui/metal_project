import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-print-bill',
  templateUrl: './print-bill.component.html',
  styleUrls: ['./print-bill.component.scss']
})
export class PrintBillComponent implements OnInit {
  private sub: Subscription;

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(response => {
      console.log(response);
    });
  }

}
