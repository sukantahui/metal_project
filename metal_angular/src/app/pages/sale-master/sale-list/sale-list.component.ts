import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SaleService} from '../../../services/sale.service';
import {SaleItem} from '../../../models/sale.model';
import { faUserEdit, faTrashAlt, faPencilAlt, faPrint} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit {
  saleList: SaleItem[] = [];
  pageSize = 10;
  p = 1;
  faUserEdit = faUserEdit;
  faTrashAlt = faTrashAlt;
  faPencilAlt = faPencilAlt;
  faPrint = faPrint;
  constructor(private http: HttpClient, private saleService: SaleService) { }

  ngOnInit(): void {
    this.saleList = this.saleService.getSaleList();
    this.saleService.getSaleListListener().subscribe(response => {
      this.saleList = response;
    });
  }

}
