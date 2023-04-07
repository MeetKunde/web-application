import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./../app.component.css']
})
export class LoginComponent implements OnInit {
  public user: any;

  constructor(public _userService: UserService) { }

  ngOnInit(): void {
    this.user = {
      username: '',
      password: ''
    };
  }

  login() {
    this._userService.login({ 'username': this.user.username, 'password': this.user.password });
  }

  loginAsAnonymousUser() {
    this._userService.login({ 'username': 'Anonymous', 'password': 'anonymous-password' });
  }
}
