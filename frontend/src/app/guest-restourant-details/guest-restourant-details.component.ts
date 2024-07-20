import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { Restourant } from '../models/restourant';
import { Reservation } from '../models/reservation';
import { Dish } from '../models/dish';

@Component({
  selector: 'app-guest-restourant-details',
  templateUrl: './guest-restourant-details.component.html',
  styleUrls: ['./guest-restourant-details.component.css']
})
export class GuestRestourantDetailsComponent implements OnInit{

  currentRestourantName:string = ''
  currentRestourant: any

  currentUsername: string | null = ''
  menuList: any[] = []
  orderAmounts: { [key: string]: string } = {};

  orderProducts: any[] = []

  constructor(private route: ActivatedRoute, private userService: DataService, private sanitizer: DomSanitizer, private http: HttpClient) { }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentRestourantName = params['restourant'];
    })

    this.currentUsername = localStorage.getItem("username")

    let formData = new FormData()
    formData.append("name", this.currentRestourantName)

    this.http.post<{"restourant" : Restourant}>('http://localhost:3000/restourants/restourantByName', formData)
          .subscribe(response => {
            this.currentRestourant = response.restourant

            console.log('Image uploaded successfully', response);
          }, error => {
            console.error('Error uploading image', error);
          });

    this.http.post<Dish[]>('http://localhost:3000/restourants/menuListByName', formData)
          .subscribe(response => {
            this.menuList = response

            console.log("menuList: ", this.menuList)

            for(let dish of this.menuList){
              let image = "data:image/jpg;base64," + dish.profilePictureUrl
              dish.image = this.sanitizer.bypassSecurityTrustUrl(image);
            }

            console.log('Image uploaded successfully', response);
          }, error => {
            console.error('Error uploading image', error);
          });
  }

  selectedDate: string = ''
  selectedTime: string = ''
  numOfPersons: string = ''
  additionalInfo: string = ''

  registrationMessage: string = ''

  submitForm() {
    console.log("Form submitted with data:", {
      selectedDate: this.selectedDate,
      selectedTime: this.selectedTime,
      numOfPersons: this.numOfPersons,
      additionalInfo: this.additionalInfo,
    });

    if(this.selectedDate && this.selectedTime && this.numOfPersons){
      const formData = new FormData();

      const regex = /^[0-9]+$/;
      if(!regex.test(this.numOfPersons)){
        this.registrationMessage = 'Number of persons must be number.';
        return
      }

      if(this.currentUsername){
        formData.append('user', this.currentUsername);
      }
      formData.append('restourant', this.currentRestourantName);
      formData.append('date', this.selectedDate)
      formData.append('time', this.selectedTime)
      formData.append('numOfPersons', this.numOfPersons)
      formData.append('additionalInfo', this.additionalInfo)
      formData.append('restourantAddress', this.currentRestourant.address)
      formData.append('status', 'pending')
      formData.append('waiter', 'nobody')
      formData.append('declineComment', 'no comment')


      this.http.post<{status: string}>('http://localhost:3000/reservations/addReservation', formData)
        .subscribe(response => {
          let status = response.status

          if(status === "created"){
            this.registrationMessage = "Successfully created reservation."
            return
          }

          if(status === "not created"){
            this.registrationMessage = "Termin nedostupan."
            return
          }

          this.registrationMessage = "Error."
          return
          
        }, error => {
          console.error('Error uploading image', error);
        });
        return
    } else {
      this.registrationMessage = "All parameters must be present."
      return
    }
  }

  addItemInput(uniqueName: string): void {
    const inputValue = this.orderAmounts[uniqueName] || '';
    if (inputValue) {
      this.orderProducts.push({uniqueName: uniqueName, amount: inputValue})
      //console.log("product: ", uniqueName, inputValue)
    }
  }

  orderMessage: string = ''

  makeOrder(){
    this.updateCurrentDateTime()
    console.log(this.currentDate)
    console.log(this.currentTime)

    if(this.orderProducts.length === 0){
      this.orderMessage = "Basket is empty."
      return
    }

    let products = ""
    for(let product of this.orderProducts){
      products += "|"
      products += product.uniqueName
      products += "#"
      products += product.amount
    }

    products = products.substring(1)

    console.log(products)

    let formData = new FormData()

    if(this.currentUsername){
      formData.append('user', this.currentUsername);
    }
    formData.append('restourant', this.currentRestourantName);
    formData.append('date', this.currentDate)
    formData.append('time', this.currentTime)
    formData.append('products', products)
    formData.append('status', 'not approved')
    formData.append('approximateTime', 'NA')

    this.http.post<{status: string}>('http://localhost:3000/orders/addOrder', formData)
        .subscribe(response => {
          // let status = response.status

          // if(status === "created"){
          //   this.registrationMessage = "Successfully created reservation."
          //   return
          // } ...
          
        }, error => {
          console.error('Error uploading image', error);
        });
        

    this.orderMessage = "Successfully made order."
    return
  }


  currentDate: string = ''
  currentTime: string = ''

  updateCurrentDateTime(): void {
    const now = new Date();
    this.currentDate = this.formatDate(now);
    this.currentTime = this.formatTime(now);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  formatTime(date: Date): string {
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

}
