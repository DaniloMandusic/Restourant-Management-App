import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//ng add @angular/material
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    MainpageComponent,
    LoginComponent,
    ChangePasswordComponent,
    UnregisteredComponent,
    GuestProfileComponent,
    GuestRestourantsComponent,
    GuestRestourantDetailsComponent,
    GuestReservationsComponent,
    GuestDeliveryComponent,
    WaiterProfileComponent,
    WaiterReservationsComponent,
    WaiterOrdersComponent,
    WaiterStatisticsComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
