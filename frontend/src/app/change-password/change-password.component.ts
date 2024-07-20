import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  registrationMessage: string = '';

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {
    
  }

  onSubmit(registrationForm: NgForm): void {

    if (
      registrationForm.value.username &&
      registrationForm.value.oldPassword &&
      registrationForm.value.newPassword &&
      registrationForm.value.newPasswordConfirmation 
    ) {

      const formData = new FormData();
      
      formData.append('username', registrationForm.value.username);  
      formData.append('oldPassword', registrationForm.value.oldPassword);
      formData.append('newPassword', registrationForm.value.newPassword);
      formData.append('newPasswordConfirmation', registrationForm.value.newPasswordConfirmation);

      if(registrationForm.value.newPassword !== registrationForm.value.newPasswordConfirmation ){
        this.registrationMessage = "Password confirmation doesent match."
        return
      }

      this.http.post('http://localhost:3000/users/changePassword', formData)
          .subscribe(response => {
            console.log('Image uploaded successfully', response);

            if(response){
              this.registrationMessage = "Password succesfully changed."
              return
            }

            this.registrationMessage = "Bad parameters."
            return

          }, error => {
            console.error('Error uploading image', error);
          });

      
    } else {
      this.registrationMessage = 'All parameters must be present.';
    }

  }


}
