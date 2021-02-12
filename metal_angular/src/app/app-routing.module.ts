import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {AuthComponent} from './pages/auth/auth.component';
import {AuthGuardService} from './services/auth-guard.service';
import {OwnerComponent} from './pages/owner/owner.component';




import {ProductComponent} from './pages/product/product.component';
import {CustomerComponent} from './pages/customer/customer.component';
import {VendorComponent} from './pages/vendor/vendor.component';
import {PurchaseComponent} from './pages/purchase/purchase.component';
import {SaleComponent} from "./pages/sale/sale.component";


// @ts-ignore
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'owner', canActivate:  [AuthGuardService], component: OwnerComponent},
  {path: 'customer', canActivate:  [AuthGuardService], component: CustomerComponent},
  {path: 'vendor', canActivate:  [AuthGuardService], component: VendorComponent},
  {path: 'products', canActivate:  [AuthGuardService], component: ProductComponent},
  {path: 'purchase', canActivate:  [AuthGuardService], component: PurchaseComponent},
  {path: 'sale', canActivate:  [AuthGuardService], component: SaleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
