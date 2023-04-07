/**
 * Module contains implementation of PointComponent. This button is used to create point.
 * 
 * @module Point Component
 */

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-point',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/PointIcon.svg" (click)="onClick();" [ngClass]="{'icon-button-clicked': toggle}" alt="Point Creating">
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class PointComponent {
  /** 
   * Variable used to save state of this button.
   * @ignore */
  public toggle: boolean = false;

  /** Empty function */
  constructor() { }

  /**
   * Function called after clicked on this component(button).
   * Enable or disable drawing points on {@link Canvas}.
   */
  onClick(): void {
    if (Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE) {
      Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.POINT);
      this.toggle = !this.toggle;
    }
    else if (Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.POINT) {
      Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.NONE);
      this.toggle = !this.toggle;
    }
  }
}
