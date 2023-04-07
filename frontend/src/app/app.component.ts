import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { SchemeService } from './services/scheme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(public _schemeService: SchemeService, public _userService: UserService) { }
   
    ngOnInit() { }
}
