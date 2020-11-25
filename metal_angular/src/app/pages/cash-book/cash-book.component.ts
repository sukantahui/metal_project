import { Component, OnInit } from '@angular/core';
import {Book, ReportService} from '../../services/report.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.scss']
})
export class CashBookComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private bookService: ReportService) {
    console.log('Constructor working');
  }

  get book() {
    return this.bookForm.get('book');
  }
  $allBooks: Observable<Book[]>;
  $filteredBooks: Observable<Book[]>;
  bookForm = new FormGroup({
    book: new FormControl(null, [Validators.required])
  });
  // bookForm = this.formBuilder.group({
  //   book: [null, Validators.required]
  // });

  ngOnInit(): void {
    this.$allBooks = this.bookService.getAllBooks();
    this.$filteredBooks = this.book.valueChanges
      .pipe(
        startWith(''),
        switchMap(value => this.filterBooks(value))
      );
  }

  private filterBooks(value: string | Book) {
    let filterValue = '';
    if (value) {
      filterValue = typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
      return this.$allBooks.pipe(
        map(books => books.filter(book => book.name.toLowerCase().includes(filterValue)))
      );
    } else {
      return this.$allBooks;
    }
  }

  displayFn(book?: Book): string | undefined {
    return (book ? book.name : undefined);
  }
  onFormSubmit() {
    this.bookService.saveBook(this.bookForm.value);
    this.resetForm();
  }
  resetForm() {
    this.bookForm.reset();
  }
}
