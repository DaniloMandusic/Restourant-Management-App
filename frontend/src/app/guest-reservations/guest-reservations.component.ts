import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RestourantWaiter } from '../models/restourantWaiter';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-guest-reservations',
  templateUrl: './guest-reservations.component.html',
  styleUrls: ['./guest-reservations.component.css']
})
export class GuestReservationsComponent implements OnInit{

  currentUsername: string | null = ''
  currentReservations: any[] = []
  pastReservations: any[] = []

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {
    
  }


  ngOnInit(): void {

    this.currentUsername = localStorage.getItem("username")

    let formData = new FormData()
    if(this.currentUsername){
      formData.append("username", this.currentUsername)
    }
    
    this.http.post<RestourantWaiter[]>('http://localhost:3000/guests/currentReservationsList', formData)
          .subscribe(response => {
            this.currentReservations = response
            console.log(this.currentReservations)

          }, error => {
            console.error('Error getting restourants count', error);
          });

    this.http.post<RestourantWaiter[]>('http://localhost:3000/guests/pastReservationsList', formData)
          .subscribe(response => {
            this.pastReservations = response
            console.log(this.pastReservations)

          }, error => {
            console.error('Error getting restourants count', error);
          });

  }

}
