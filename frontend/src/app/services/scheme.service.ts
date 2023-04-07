import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable()
export class SchemeService {

  constructor(private http: HttpClient, private _userService: UserService) { }

  list() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this._userService.accessToken
      })
    };
    return this.http.get('/api/schemes', httpOptions);
  }

  create(scheme: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this._userService.accessToken
      })
    };
    return this.http.post('/api/schemes', JSON.stringify(scheme), httpOptions);
  }

}