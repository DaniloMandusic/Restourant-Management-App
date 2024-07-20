import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { DataService } from '../services/data.service';
import { User } from '../models/user';

@Component({
  selector: 'app-waiter-orders',
  templateUrl: './waiter-orders.component.html',
  styleUrls: ['./waiter-orders.component.css']
})
export class WaiterOrdersComponent implements OnInit{

  notApprovedOrders: Order[] = []
  currentUser: User|null = null

  selectedOptions: { [key: string]: string } = {};

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(){
    let formData = new FormData()

    let username = localStorage.getItem("username")    

    console.log(username)

    if(username){
      formData.append("username", username)
    } else {
      formData.append("username", "no username")
    }

    this.http.post<{user: User}>('http://localhost:3000/users/userByUsername', formData)
        .subscribe(response => {
          this.currentUser = response.user

          formData.append("restourant", this.currentUser.restourant)

        }, error => {
          console.error('Error getting restourants count', error);
        }, () => {
          this.http.post<Order[]>('http://localhost:3000/orders/notApprovedOrdersByRestourant', formData)
          .subscribe(response => {
            this.notApprovedOrders = response

            for(let order of this.notApprovedOrders){
              order.products = order.products.replaceAll("#", "-")
              order.products = order.products.replaceAll("|", ", ")
            }
  
          }, error => {
            console.error('Error getting restourants count', error);
          });
        });
  }

  isConfirmDisabled(order: Order): boolean {
    return !this.selectedOptions[order.user+order.date+order.time];
  }

  onConfirm(order: Order) {
    let formData = new FormData()
    formData.append("approximateTime", this.selectedOptions[order.user+order.date+order.time])
    formData.append("user", order.user)
    formData.append("date", order.date)
    formData.append("time", order.time)

    this.http.post<{status: string}>('http://localhost:3000/orders/confirmOrder', formData)
          .subscribe(response => {
            window.location.reload()

          }, error => {
            console.error('Error getting restourants count', error);
          });
  }

  onDecline(order: Order) {
    let formData = new FormData()
    //formData.append("approximateTime", this.selectedOptions[order.user+order.date+order.time])
    formData.append("user", order.user)
    formData.append("date", order.date)
    formData.append("time", order.time)

    this.http.post<{status: string}>('http://localhost:3000/orders/declineOrder', formData)
          .subscribe(response => {
            window.location.reload()
            
          }, error => {
            console.error('Error getting restourants count', error);
          });
  }

}
