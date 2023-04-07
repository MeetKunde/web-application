/**
 * Module contains implementation of LineComponent. This button is used to create line.
 * 
 * @module Line Component
 */

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-line',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/LineIcon.svg" (click)="onClick();" [ngClass]="{'icon-button-clicked': toggle}" alt="Line Creating">
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class LineComponent {
  /** 
   * Variable used to save state of this button.
   * @ignore */
  public toggle: boolean = false;

  /** Empty function */
  constructor() { }

  /**
   * Function called after clicked on this component(button).
   * Enable or disable drawing lines on {@link Canvas}.
   */
  onClick(): void {
    if (Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE) {
      Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.LINE);
      this.toggle = !this.toggle;
    }
    else if (Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.LINE) {
      Canvas.clearBatchLayer();
      Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.NONE);
      this.toggle = !this.toggle;
    }
  }
}