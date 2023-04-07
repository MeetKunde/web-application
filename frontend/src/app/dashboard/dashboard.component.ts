/**
 * Module contains implementation of DashboardComponent. This is the main component of the application.
 * 
 * @module Dashboard Component
 */

import { Component, OnInit } from '@angular/core';
import { Canvas } from './canvas';
import { ToastrService } from 'ngx-toastr';
import { ShapesCreatorComponent } from './shapes-creator/shapes-creator.component';
import { DependenciesPresenter } from './dependencies-presenter/dependencies-presenter';
import { SchemeService } from '../services/scheme.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayShapesCreator = true;
  displayDependenciesPresenter = false;
  uiIsBlocked = true;

  /**
   * Subscribing BehaviorSubjects from {@link ComplexShapeCreator}.
   * Adding listeners for messages from backend and linking them to functions from {@link Canvas}.
   * Binding ToastrService to alert-messages(alert types: positive, neutral, negative) from backend.
   * @param toastr instance of ToastrService 
   */
  constructor(private toastr: ToastrService, public _schemeService: SchemeService, public _userService: UserService) {
    ShapesCreatorComponent.displayShapesCreator$.subscribe(value => {
      this.displayShapesCreator = value;
    });

    DependenciesPresenter.displayDependenciesPresenter$.subscribe(value => {
      this.displayDependenciesPresenter = value;
    });

    Canvas.blockInterface$.subscribe(value => {
      this.uiIsBlocked = value;
    });
  }

  /**
   * Initializng Canvas.
   * Adding window event listener to resize window event - reinitialization of Canvas.
   */
  ngOnInit(): void {
    // initializing canvas
    Canvas.init(
      document.getElementById('canvas')!.clientWidth,
      document.getElementById('canvas')!.clientHeight,
      'canvas', this.toastr);

    ShapesCreatorComponent.displayShapesCreator$.next(true);

    // avoid resizing the window to avoid problems with canva 
    // when the window size is changed, the new canva is loaded - current data are lost
    window.addEventListener('resize', () => Canvas.reinit(), true);
  }

  logout() {
    this._userService.logout();
  }

}
