import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RestourantWaiter } from '../models/restourantWaiter';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-guest-restourants',
  templateUrl: './guest-restourants.component.html',
  styleUrls: ['./guest-restourants.component.css']
})
export class GuestRestourantsComponent  implements OnInit{

  restourantWaiterList: RestourantWaiter[] = []

  dataSource: MatTableDataSource<RestourantWaiter> = new MatTableDataSource<RestourantWaiter>([]);
  displayedColumns: string[] = ['restourant', 'restourantAdress', 'restourantType', 'waiterName', 'waiterSurname'];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {
    
  }


  ngOnInit(): void {
    
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

  viewDetails(restourant: string) {
    this.router.navigate(['/guestRestourantDetails', restourant]);
  }

}
