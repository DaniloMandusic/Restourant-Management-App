import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { RestourantWaiter } from '../models/restourantWaiter';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-unregistered',
  templateUrl: './unregistered.component.html',
  styleUrls: ['./unregistered.component.css']
})
export class UnregisteredComponent  implements OnInit {

  restourantCount: string = '';
  guestCount: string = '';
  reservationCount24: string = '';
  reservationCount7: string = '';
  reservationCount30: string = '';
  restourantWaiterList: RestourantWaiter[] = []

  dataSource: MatTableDataSource<RestourantWaiter> = new MatTableDataSource<RestourantWaiter>([]);
  displayedColumns: string[] = ['restourant', 'restourantAdress', 'restourantType', 'waiterName', 'waiterSurname'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {
    
  }

  ngOnInit(): void {
    
    this.http.get<{count: string}>('http://localhost:3000/restourants/count')
          .subscribe(response => {
            this.restourantCount = response.count
          }, error => {
            console.error('Error getting restourants count', error);
          });

    this.http.get<{count: string}>('http://localhost:3000/users/guestCount')
          .subscribe(response => {
            this.guestCount = response.count
          }, error => {
            console.error('Error getting restourants count', error);
          });

    this.http.get<{count: string}>('http://localhost:3000/reservations/count24')
          .subscribe(response => {
            this.reservationCount24 = response.count
          }, error => {
            console.error('Error getting restourants count', error);
          });

    this.http.get<{count: string}>('http://localhost:3000/reservations/count7')
          .subscribe(response => {
            this.reservationCount7 = response.count
          }, error => {
            console.error('Error getting restourants count', error);
          });

    this.http.get<{count: string}>('http://localhost:3000/reservations/count30')
          .subscribe(response => {
            this.reservationCount30 = response.count
          }, error => {
            console.error('Error getting restourants count', error);
          });

    this.http.get<RestourantWaiter[]>('http://localhost:3000/restourantWaiterList')
          .subscribe(response => {
            this.restourantWaiterList = response
            //console.log(this.restourantWaiterList)

            this.dataSource = new MatTableDataSource(this.restourantWaiterList);
            this.dataSource.sort = this.sort;
          }, error => {
            console.error('Error getting restourants count', error);
          });

  }

  searchInput: string = '';

  applyFilter() {
    const filterValue = this.searchInput.toLowerCase();
    this.dataSource.filter = filterValue.trim();
  }

}
