import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>('http://localhost:3000/users');
  }

  checkUsername(formData: FormData): Observable<{ status: string }> {
    return this.http.post<{ status: string }>('http://localhost:3000/users/checkUsername', formData);
  }

}
