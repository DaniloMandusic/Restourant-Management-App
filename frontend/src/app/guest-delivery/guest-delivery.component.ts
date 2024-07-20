import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RestourantWaiter } from '../models/restourantWaiter';
import { DataService } from '../services/data.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-guest-delivery',
  templateUrl: './guest-delivery.component.html',
  styleUrls: ['./guest-delivery.component.css']
})
export class GuestDeliveryComponent {

  currentUsername: string | null = ''
  approvedOrders: any[] = []
  finishedOrders: any[] = []


  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {

    this.currentUsername = localStorage.getItem("username")

    let formData = new FormData()
    if(this.currentUsername){
      formData.append("user", this.currentUsername)
    }
    
    this.http.post<Order[]>('http://localhost:3000/orders/approvedOrders', formData)
          .subscribe(response => {
            this.approvedOrders = response
            console.log(this.approvedOrders)

          }, error => {
            console.error('Error getting restourants count', error);
          });

    this.http.post<Order[]>('http://localhost:3000/orders/finishedOrders', formData)
          .subscribe(response => {
            this.finishedOrders = response
            console.log(this.finishedOrders)

          }, error => {
            console.error('Error getting restourants count', error);
          });

  }

}
