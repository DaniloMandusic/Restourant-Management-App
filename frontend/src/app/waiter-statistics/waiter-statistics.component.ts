import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { DataService } from '../services/data.service';

//npm install chart.js
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-waiter-statistics',
  templateUrl: './waiter-statistics.component.html',
  styleUrls: ['./waiter-statistics.component.css']
})
export class WaiterStatisticsComponent implements OnInit{
  currentUser: User|null = null
  ret1: number[] = []
  waiterNames: string[] = []
  waiterCustomers: number[] = []
  ret3: number[] = []

  weekdaysLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {

    let username = localStorage.getItem("username")    
    console.log(username)

    let formData = new FormData()

    if(username){
      formData.append("username", username)
      formData.append("waiter", username)
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
            this.http.post<{ret: number[]}>('http://localhost:3000/waiterGraph1', formData)
              .subscribe(response => {
                this.ret1 = response.ret
                console.log("ret1 " + this.ret1)
                //create chart 1
                this.chart1()

                
              }, error => {
                console.error('Error getting restourants count', error);
              }, () => {
                this.http.post<{waiterNames: string[], waiterCustomers: number[]}>('http://localhost:3000/waiterGraph2', formData)
                  .subscribe(response => {
                    this.waiterNames = response.waiterNames
                    this.waiterCustomers = response.waiterCustomers
                    console.log("ret2 " + this.waiterNames + this.waiterCustomers)
                    this.chart2()
                    
                  }, error => {
                    console.error('Error getting restourants count', error);
                  }, () => {
                    this.http.post<{ret: number[]}>('http://localhost:3000/waiterGraph3', formData)
                      .subscribe(response => {
                        this.ret3 = response.ret
                        console.log("ret3 " + this.ret3)

                        this.chart3()
                        
                      }, error => {
                        console.error('Error getting restourants count', error);
                      }, () => {
                

                  })

                  })

              })
          })
  }

  chart1(): void {
    const canvas = document.getElementById('barChartCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get 2D context from canvas");
      return;
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.weekdaysLabels,
        datasets: [{
          label: 'Data for Days of the Week',
          data: this.ret1,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(199, 199, 199, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  chart2(): void {
    const canvas = document.getElementById('pieChartCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get 2D context from canvas");
      return;
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.waiterNames,
        datasets: [{
          label: 'Number of Customers',
          data: this.waiterCustomers,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(199, 199, 199, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  chart3(): void {
    const canvas = document.getElementById('histogramCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get 2D context from canvas");
      return;
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.weekdaysLabels,
        datasets: [{
          label: 'Number of Occurrences',
          data: this.ret3,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
