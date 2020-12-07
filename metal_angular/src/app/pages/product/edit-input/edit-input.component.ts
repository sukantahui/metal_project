import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-edit-input',
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss']
})
export class EditInputComponent implements OnInit {
  @Input() data: any;
  @Output() focusOut: EventEmitter<number> = new EventEmitter<number>();
  currency = '$';
  editMode = false;
  constructor() { }

  ngOnInit(): void {
  }
  onFocusOut() {
    this.focusOut.emit(this.data.opening_balance);
  }

  test() {
    alert("sdfgs");
  }
}
