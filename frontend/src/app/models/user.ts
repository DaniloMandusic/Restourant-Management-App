import { SafeUrl } from "@angular/platform-browser";

export class User {
    //id: string = '';
    // val: number = 0;
    username: string = '';
    password: string = '';
    securityQuestion: string = '';
    securityAnswer: string = '';
    name: string = ''
    surname: string = ''
    gender: string = ''
    address: string = ''
    phoneNumber: string = ''
    email: string = ''
    profilePicture: File = new File(["D:\\danilo\\Fax\\9 semestar\\PIA\\projekat\\frontend\\src\\app\\data\\81388322.jpg"], "profilePicture")
    profilePictureUrl: string = 'no url'
    image: any
    profileType: string = ''
    profileStatus: string = ''
    cardNumber: string = ''

    restourant: string = ''

  }