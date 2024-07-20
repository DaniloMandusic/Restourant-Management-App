import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationMessage: string = '';
  selectedFile: File | null = null //new File(["assets\\Screenshot 2024-01-07 143614.jpg"], "profilePicture");
  selectedFileUrl: string = '' //URL.createObjectURL(this.selectedFile);

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {
    
  }

  onSubmit(registrationForm: NgForm): void {
    
    

    if (
      registrationForm.value.username &&
      registrationForm.value.password &&
      registrationForm.value.securityQuestion &&
      registrationForm.value.securityAnswer &&
      registrationForm.value.name &&
      registrationForm.value.surname &&
      registrationForm.value.gender &&
      registrationForm.value.address &&
      registrationForm.value.phoneNumber &&
      registrationForm.value.email &&
      registrationForm.value.cardNumber
    ) {

      if(registrationForm.value.phoneNumber){
        const regex = /^[0-9]+$/;
  
        if(!regex.test(registrationForm.value.phoneNumber)){
          this.registrationMessage = 'bad phone number';
          return
        }
      }
  
      if (!this.isEmailValid(registrationForm.value.email)){
        this.registrationMessage = 'bad email';
        return
      }
  
      if (!this.isPasswordValid(registrationForm.value.password)){
        this.registrationMessage = 'bad password';
        return
      }  
      
      const formData = new FormData();
      if(this.selectedFile){
        formData.append('file', this.selectedFile);
      }else{
        formData.append('file', 'no file');
      }
      
      formData.append('username', registrationForm.value.username);  
      formData.append('password', registrationForm.value.password);
      formData.append('securityQuestion', registrationForm.value.securityQuestion);
      formData.append('securityAnswer', registrationForm.value.securityAnswer);
      formData.append('name', registrationForm.value.name);
      formData.append('surname', registrationForm.value.surname);
      formData.append('gender', registrationForm.value.gender);
      formData.append('address', registrationForm.value.address);
      formData.append('phoneNumber', registrationForm.value.phoneNumber);
      formData.append('email', registrationForm.value.email);
      formData.append('schoolType', registrationForm.value.schoolType);
      formData.append('profilePicture', registrationForm.value.profilePicture);
      formData.append('profilePictureUrl', registrationForm.value.profilePictureUrl);
      formData.append('profileType', 'guest');
      formData.append('profileStatus', 'not approved');

      let usernameStatus = "no status"
      this.dataService.checkUsername(formData).subscribe(
        data => {
          usernameStatus = data.status
          console.log(data.status)

        }, error => {
          console.error('Error fetching username status from backend', error);
          return
        }, () =>{

          if(usernameStatus === "taken"){
            this.registrationMessage = 'username allready taken';
            return
          } else if(usernameStatus === "no status"){
            this.registrationMessage = 'error checking username';
            return
          }

          this.http.post('http://localhost:3000/users/addUser', formData)
          .subscribe(response => {
            console.log('Image uploaded successfully', response);
          }, error => {
            console.error('Error uploading image', error);
          });

          localStorage.setItem('username', registrationForm.value.username);

          this.registrationMessage = 'sve je u redu';
          //this.router.navigate(['/registerTeacher']);
          return
        }
      )
      
    } else {
      this.registrationMessage = 'All parameters must be present.';
    }

  }
      


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;

    
    if (this.selectedFile) {
      this.selectedFileUrl = URL.createObjectURL(this.selectedFile);

      this.validateFile(this.selectedFile);
    }
  }

  allowedTypes: string[] = ['.jpg', '.png'];

  private validateFile(file: File): void {
    // if (this.allowedTypes.indexOf(file.type) === -1) {
    //   this.registrationMessage =  'Invalid file type. Please upload a JPG or PNG image.'
    //   return;
    // }

    const fileName = file.name.toLowerCase();
    console.log(fileName)
    if (!this.allowedTypes.some(ext => fileName.endsWith(ext))) {
      //alert('Invalid file type. Please upload a JPG or PNG image.');
      this.registrationMessage =  'Invalid file type. Please upload a JPG or PNG image.'
      return;
    }

    const img = new Image();
    img.src = this.selectedFileUrl
    img.onload = (e: any) => {
      if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
        console.log(img.width, img.height)
        this.registrationMessage = `Invalid dimensions. Please upload an image between 100x100 and 300x300 pixels.`
        return;
      }
    };
    
  }

  isPasswordValid(password: string): boolean {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*[!@#$%^&*]).{6,10}$/;
    return passwordRegex.test(password);
  }

  isEmailValid(email: string): boolean {
    
    return /\S+@\S+\.\S+/.test(email);
  }

}
