/**
 * Module contains implementation of CircleComponent. This button is used to create circle.
 * 
 * @module Circle Component
 */

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-circle',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/CircleIcon.svg" (click)="onClick();" [ngClass]="{'icon-button-clicked': toggle}" alt="Circle Creating">
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class CircleComponent {
  /** 
   * Variable used to save state of this button.
   * @ignore */
  public toggle: boolean = false;

  /** Empty function */
  constructor() { }

  /**
   * Function called after clicked on this component(button).
   * Enable or disable drawing circles on {@link Canvas}.
   */
  onClick(): void {
    if (Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE) {
      Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.CIRCLE);
      this.toggle = !this.toggle;
    }
    else if (Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.CIRCLE) {
      Canvas.clearBatchLayer();
      Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.NONE);
      this.toggle = !this.toggle;
    }
  }
}