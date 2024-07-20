import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Reservation } from '../models/reservation';
import { DataService } from '../services/data.service';
import { User } from '../models/user';
import { Restourant } from '../models/restourant';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

  guests: User[] = []
  waiters: User[] = []

  restourants: Restourant[] = []

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void{
    
    this.http.get<User[]>('http://localhost:3000/users/guests')
            .subscribe(response => {
              this.guests = response
              console.log(this.guests)
  
            }, error => {
              console.error('Error getting restourants count', error);
            })

    this.http.get<User[]>('http://localhost:3000/users/waiters')
            .subscribe(response => {
              this.waiters = response
              console.log(this.waiters)
  
            }, error => {
              console.error('Error getting restourants count', error);
            })

    this.http.get<Restourant[]>('http://localhost:3000/restourants')
            .subscribe(response => {
              this.restourants = response
  
            }, error => {
              console.error('Error getting restourants count', error);
            })


  }


  printUser(user: User) {
    let formData = new FormData()
    formData.append("username", user.username)
    formData.append("password", user.password)
    formData.append("securityQuestion", user.securityQuestion)
    formData.append("securityAnswer", user.securityAnswer)
    formData.append("name", user.name)
    formData.append("surname", user.surname)
    formData.append("gender", user.gender)
    formData.append("address", user.address)
    formData.append("phoneNumber", user.phoneNumber)
    formData.append("email", user.email)
    formData.append("profileType", user.profileType)
    if(user.restourant)
    formData.append("restourant", user.restourant)
  
    this.http.post<{status: string}>('http://localhost:3000/users/changeUser', formData)
            .subscribe(response => {
              console.log(response.status)
  
            }, error => {
              console.error('Error getting restourants count', error);
            })

  }

  changeRestourant(restourant: Restourant) {
    let formData = new FormData()
    formData.append("name", restourant.name)
    formData.append("type", restourant.type)
    formData.append("address", restourant.address)
    
  
    this.http.post<{status: string}>('http://localhost:3000/restourants/changeRestourant', formData)
            .subscribe(response => {
              console.log(response.status)
  
            }, error => {
              console.error('Error getting restourants count', error);
            })

  }

}
