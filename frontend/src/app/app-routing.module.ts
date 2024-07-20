import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UnregisteredComponent } from './unregistered/unregistered.component';
import { GuestProfileComponent } from './guest-profile/guest-profile.component';
import { GuestRestourantsComponent } from './guest-restourants/guest-restourants.component';
import { GuestRestourantDetailsComponent } from './guest-restourant-details/guest-restourant-details.component';
import { GuestReservationsComponent } from './guest-reservations/guest-reservations.component';
import { GuestDeliveryComponent } from './guest-delivery/guest-delivery.component';
import { WaiterProfileComponent } from './waiter-profile/waiter-profile.component';
import { WaiterReservationsComponent } from './waiter-reservations/waiter-reservations.component';
import { WaiterOrdersComponent } from './waiter-orders/waiter-orders.component';
import { WaiterStatisticsComponent } from './waiter-statistics/waiter-statistics.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mainpage', component: MainpageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'changePassword', component: ChangePasswordComponent },
  { path: 'unregistered', component: UnregisteredComponent },
  { path: 'guestProfile', component: GuestProfileComponent },
  { path: 'guestRestourants', component: GuestRestourantsComponent },
  { path: 'guestRestourantDetails/:restourant', component: GuestRestourantDetailsComponent },
  { path: 'guestReservations', component: GuestReservationsComponent },
  { path: 'guestDelivery', component: GuestDeliveryComponent },
  { path: 'waiterProfile', component: WaiterProfileComponent },
  { path: 'waiterReservations', component: WaiterReservationsComponent },
  { path: 'waiterDelivery', component: WaiterOrdersComponent },
  { path: 'waiterStatistics', component: WaiterStatisticsComponent },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
