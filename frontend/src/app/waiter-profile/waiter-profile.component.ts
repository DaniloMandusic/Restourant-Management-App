import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-waiter-profile',
  templateUrl: './waiter-profile.component.html',
  styleUrls: ['./waiter-profile.component.css']
})
export class WaiterProfileComponent implements OnInit{

  currentUser: User = new User
  registrationMessage: string = ""

  selectedFile: File | null = null 
  selectedFileUrl: string = '' 

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {

    let formData = new FormData()
    let username = localStorage.getItem("username")

    console.log(username)

    if(username){
      formData.append("username", username)
    } else {
      formData.append("username", "no username")
    }
    
    
    this.http.post<{user: User}>('http://localhost:3000/users/userByUsername', formData)
          .subscribe(response => {
            this.currentUser = response.user
            // console.log(this.currentUser)
            // console.log(this.currentUser.email)
            let image = "data:image/jpg;base64," + this.currentUser.profilePictureUrl
            this.currentUser.image = this.sanitizer.bypassSecurityTrustUrl(image);

            this.selectedFile = this.currentUser.profilePicture
            this.selectedFileUrl = this.currentUser.image
            
          }, error => {
            console.error('Error getting restourants count', error);
          });

  }

  onSubmit(registrationForm: NgForm){

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
