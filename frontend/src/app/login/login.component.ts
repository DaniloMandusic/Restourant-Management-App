import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  registrationMessage: string = '';

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {
    
  }

  onSubmit(registrationForm: NgForm): void {

    if (
      registrationForm.value.username &&
      registrationForm.value.password
      
    ) {
  
      if (!this.isPasswordValid(registrationForm.value.password)){
        this.registrationMessage = 'bad password format';
        return
      }  
      
      const formData = new FormData();
      
      formData.append('username', registrationForm.value.username);  
      formData.append('password', registrationForm.value.password);

      let usernameStatus = "no status"
      this.dataService.checkUsername(formData).subscribe(
        data => {
          usernameStatus = data.status
          console.log(data.status)

        }, error => {
          console.error('Error fetching username status from backend', error);
          return
        }, () =>{

          if(usernameStatus === "free"){
            this.registrationMessage = 'user dont exist';
            return
          } else if(usernameStatus === "no status"){
            this.registrationMessage = 'error checking username';
            return
          }

          let user: User|null = null;

          this.http.post<User>('http://localhost:3000/users/login', formData)
          .subscribe(response => {
            console.log('Login finished, response: ', response);

            user = response;
            if(user){

              if(user.profileStatus === 'not approved'){
                this.registrationMessage = "profile not approved yet"
                return
              }

              localStorage.setItem('username', registrationForm.value.username);

              this.registrationMessage = "sve je u redu"
              
              if(user.profileType === "guest"){
                this.router.navigate(['/guestProfile'])
              }

              if(user.profileType === "waiter"){
                this.router.navigate(['/waiterProfile'])
              }

              if(user.profileType === "admin"){
                this.router.navigate(['/admin'])
              }
              
              return
            } else{
              this.registrationMessage = "wrong username or password"
              return
            }
            
          }, error => {
            console.error('Error logging in: ', error);
          });

        }
      )
      
    } else {
      this.registrationMessage = 'All parameters must be present.';
    }

  }

  isPasswordValid(password: string): boolean {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*[!@#$%^&*]).{6,10}$/;
    return passwordRegex.test(password);
  }

}
