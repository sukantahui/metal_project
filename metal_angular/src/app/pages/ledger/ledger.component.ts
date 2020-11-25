import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {LedgerService} from '../../services/ledger.service';
import {Ledger} from "../../models/ledger.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
  ledgerForm: FormGroup;
  ledgerTypes = [
    { id: 1, ledger_type_name: 'Income' },
    { id: 2, ledger_type_name: 'Expenditure' }
  ];
  expenditureLedgers: Ledger[];
  incomeLedgers: Ledger[];
  constructor(private ledgerService: LedgerService) {}

  ngOnInit(): void {
    this.ledgerForm = this.ledgerService.ledgerForm;
    this.incomeLedgers = this.ledgerService.getIncomeLedgers();
    this.ledgerService.getIncomeLedgersUpdateListener().subscribe(data => {
      this.incomeLedgers = data;
    });

    this.expenditureLedgers = this.ledgerService.getExpenditureLedgers();
    this.ledgerService.getExpenditureLedgersUpdateListener().subscribe(data => {
      this.expenditureLedgers = data;
    });
    // this.ledgerService.getExpenditureLedgersUpdateListener().subscribe(data => {
    //   this.expenditureLedgers = data;
    // });
  }

  saveLedger() {

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
        this.ledgerService.saveLedger(this.ledgerForm.value).subscribe(response => {
          if (response.success === 1){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Ledger saved',
              showConfirmButton: false,
              timer: 3000
            }).then(r => {
              this.ledgerForm.patchValue({ledger_name: null});
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
}
