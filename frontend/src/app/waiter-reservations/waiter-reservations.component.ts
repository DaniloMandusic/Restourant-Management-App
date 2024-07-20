import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RestourantWaiter } from '../models/restourantWaiter';
import { DataService } from '../services/data.service';
import { Reservation } from '../models/reservation';
import { User } from '../models/user';
import { Restourant } from '../models/restourant';


@Component({
  selector: 'app-waiter-reservations',
  templateUrl: './waiter-reservations.component.html',
  styleUrls: ['./waiter-reservations.component.css']
})
export class WaiterReservationsComponent implements OnInit{
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  pendingReservations: Reservation[] = []
  acceptedReservations: Reservation[] = []
  currentUser: User|null = null
  currentRestourant: Restourant|null = null
  freeTables: string[] = []
  selectedNumbers: { [key: string]: number } = {};
  

  numberOfTables: number = 0
  takenTables: number[] = []

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    let formData = new FormData()
    let username = localStorage.getItem("username")    

    console.log(username)

    if(username){
      formData.append("username", username)
      formData.append("waiter", username)
    } else {
      formData.append("username", "no username")
    }
    
    
    this.http.post<{user: User}>('http://localhost:3000/users/userByUsername', formData)
          .subscribe(response => {
            this.currentUser = response.user
            formData.append("name", this.currentUser.restourant)
            
          }, error => {
            console.error('Error getting restourants count', error);
          }, () => {

            if(this.currentUser){
              formData.append("restourant", this.currentUser.restourant)
            }

            this.http.post<Reservation[]>('http://localhost:3000/reservations/pendingReservationsList', formData)
            .subscribe(response => {
              this.pendingReservations = response
              console.log(this.pendingReservations)
  
            }, error => {
              console.error('Error getting restourants count', error);
            }, () => {
              this.http.post<Reservation[]>('http://localhost:3000/reservations/acceptedReservationsList', formData)
              .subscribe(response => {
                this.acceptedReservations = response
                console.log(this.pendingReservations)
    
              }, error => {
                console.error('Error getting restourants count', error);
              }, () => {
                this.http.post<{"restourant": Restourant}>('http://localhost:3000/restourants/restourantByName', formData)
                    .subscribe(response => {
                      this.currentRestourant = response.restourant
                      console.log("curRestourant " + this.currentRestourant.type)
                      console.log("currentRestourantName: " + this.currentRestourant.name)
                      console.log(this.pendingReservations)

                      this.freeTables = this.currentRestourant.freeTables.split(',')

                      this.numberOfTables = +this.currentRestourant.numberOfTables
                      let strTakenTables = this.currentRestourant.takenTables.split(',')
                      for(let table of strTakenTables){
                        this.takenTables.push(+table)
                      }

                      console.log(this.numberOfTables, this.takenTables)

                      this.drawTables();
          
                    }, error => {
                      console.error('Error getting restourants count', error);
                    });

              })

            });

          });
  }

  acceptReservation(reservation: Reservation){
    console.log(reservation.date)

    let selectedTable = this.selectedNumbers[reservation.user+reservation.date+reservation.time]
    if(selectedTable === undefined){
      this.registrationMessage = "No table selected"
      return
    }

    console.log("selected table: " + selectedTable)

    let formData = new FormData()

    formData.append("user", reservation.user)
    formData.append("date", reservation.date)
    formData.append("time", reservation.time)
    formData.append("restourant", reservation.restourant)
    formData.append("status", "accepted")
    formData.append("table", selectedTable.toString())
    if(this.currentUser)
      formData.append("waiter", this.currentUser.username)
    
    this.http.post<{status: string}>('http://localhost:3000/reservations/acceptReservation', formData)
            .subscribe(response => {
              console.log(response.status)
  
            }, error => {
              console.error('Error getting restourants count', error);
            });

    window.location.reload()
    
  }

  registrationMessage: string = ''

  declineReservation(reservation: Reservation, declineComment: string){
    if(declineComment===''){
      this.registrationMessage = 'No decline comment'
      return
    }

    let formData = new FormData()

    formData.append("user", reservation.user)
    formData.append("date", reservation.date)
    formData.append("time", reservation.time)
    formData.append("restourant", reservation.restourant)
    formData.append("status", "declined")
    formData.append("declineComment", declineComment)
    
    this.http.post<{status: string}>('http://localhost:3000/reservations/declineReservation', formData)
            .subscribe(response => {
              console.log(response.status)
  
            }, error => {
              console.error('Error getting restourants count', error);
            });

    console.log(reservation.user)
    console.log(declineComment)

    window.location.reload()
  }


  drawTables() {
    const canvasEl = this.canvas.nativeElement;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) { 
      console.error('Failed to get 2D context');
      return; 
    }

    console.log('Canvas width:', canvasEl.width);
    console.log('Canvas height:', canvasEl.height);

    const canvasWidth = canvasEl.width;
    const canvasHeight = canvasEl.height;
    const circleRadius = 20;
    const spacing = (canvasWidth - 2 * circleRadius) / (this.numberOfTables - 1);

    console.log('Spacing:', spacing);

    for (let i = 0; i < this.numberOfTables; i++) {
      const x = circleRadius + i * spacing;
      const y = canvasHeight / 2;
      const isTaken = this.takenTables.includes(i + 1);

      console.log(`Drawing circle at (${x}, ${y}) with color ${isTaken ? 'red' : 'blue'}`);

      ctx.beginPath();
      ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
      ctx.fillStyle = isTaken ? 'red' : 'blue'; 
      ctx.fill();
      ctx.stroke();
    }
  }

  isWithinLast30Minutes(dateStr: string, timeStr: string): boolean {
    const dateTimeStr = `${dateStr}T${timeStr}:00`;

    const parsedDate = new Date(dateTimeStr);

    const now = new Date();

    const diffInMs = now.getTime() - parsedDate.getTime();

    const diffInMinutes = diffInMs / (1000 * 60);

    return diffInMinutes >= 0 && diffInMinutes <= 30;
  }


  confirmArrival(reservation: Reservation){
    let formData = new FormData()
    formData.append("user", reservation.user)
    formData.append("restourant", reservation.restourant)
    formData.append("date", reservation.date)
    formData.append("time", reservation.time)
    
    
    this.http.post<{status: string}>('http://localhost:3000/reservations/confirmArrival', formData)
            .subscribe(response => {
              console.log(response.status)

              window.location.reload()
  
            }, error => {
              console.error('Error getting restourants count', error);
            });

  }

  confirmNoArrival(reservation: Reservation){
    let formData = new FormData()
    formData.append("user", reservation.user)
    formData.append("restourant", reservation.restourant)
    formData.append("date", reservation.date)
    formData.append("time", reservation.time)
    formData.append("table", reservation.table)
    
    
    this.http.post<{status: string}>('http://localhost:3000/reservations/confirmNoArrival', formData)
            .subscribe(response => {
              console.log(response.status)

              window.location.reload()
  
            }, error => {
              console.error('Error getting restourants count', error);
            });

            

  }

}
