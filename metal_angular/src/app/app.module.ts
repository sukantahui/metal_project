import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HeaderComponent } from './pages/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MaterialModule } from './core/material.module';



import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './pages/home/home.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { PictureCarouselComponent } from './pages/home/picture-carousel/picture-carousel.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AuthComponent } from './pages/auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import {AuthInterceptorInterceptor} from './services/auth-interceptor.interceptor';
import { OwnerComponent } from './pages/owner/owner.component';
import {NgxPrintModule} from 'ngx-print';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';
import { SncakBarComponent } from './common/sncak-bar/sncak-bar.component';
import { ConfirmationDialogComponent } from './common/confirmation-dialog/confirmation-dialog.component';
import { LoaidngRippleComponent } from './shared/loaidng-ripple/loaidng-ripple.component';
import { LoaidngEllipsisComponent } from './shared/loaidng-ellipsis/loaidng-ellipsis.component';
import { LoaidngHourglassComponent } from './shared/loaidng-hourglass/loaidng-hourglass.component';
import { LoaidngRollerComponent } from './shared/loaidng-roller/loaidng-roller.component';
import { DateAdapter } from '@angular/material/core';
import { DateFormat } from './date-format';
import { ReceiveComponent } from './pages/receive/receive.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { TransactionReportComponent } from './pages/transaction-report/transaction-report.component';
import { IncomeExpenditureComponent } from './pages/income-expenditure/income-expenditure.component';
import { IncomeExpenditureHomeComponent } from './pages/income-expenditure/income-expenditure-home/income-expenditure-home.component';
import { IncomeExpenditureByYearComponent } from './pages/income-expenditure/income-expenditure-by-year/income-expenditure-by-year.component';
import { IncomeExpenditureByMonthComponent } from './pages/income-expenditure/income-expenditure-by-month/income-expenditure-by-month.component';
import { LedgerComponent } from './pages/ledger/ledger.component';
import { CashBookComponent } from './pages/cash-book/cash-book.component';
import { CashBookHomeComponent } from './pages/cash-book/cash-book-home/cash-book-home.component';
import {NgSelectModule} from '@ng-select/ng-select';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    PictureCarouselComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    OwnerComponent,
    SncakBarComponent,
    ConfirmationDialogComponent,
    LoaidngRippleComponent,
    LoaidngEllipsisComponent,
    LoaidngHourglassComponent,
    LoaidngRollerComponent,
    ReceiveComponent,
    PaymentComponent,
    TransactionReportComponent,
    IncomeExpenditureComponent,
    IncomeExpenditureHomeComponent,
    IncomeExpenditureByYearComponent,
    IncomeExpenditureByMonthComponent,
    LedgerComponent,
    CashBookComponent,
    CashBookHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPrintModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgSelectModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true},
              {provide: DateAdapter, useClass: DateFormat} ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
}
