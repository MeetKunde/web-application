/**
 * Module contains implementation of SemiLineComponent. This button is used to create semi-line.
 * 
 * @module Semi-Line Component
 */

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-semiline',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/SemiLineIcon.svg" (click)="onClick();" [ngClass]="{'icon-button-clicked': toggle}" alt="Semiline Creating">
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class SemilineComponent {
  /** 
   * Variable used to save state of this button.
   * @ignore */
  public toggle: boolean = false;

  /** Empty function */
  constructor() { }

  /**
   * Function called after clicked on this component(button).
   * Enable or disable drawing semi-lines on {@link Canvas}.
   */
  onClick(): void {
    if (Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE) {
      Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.SEMILINE);
      this.toggle = !this.toggle;
    }
    else if (Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.SEMILINE) {
      Canvas.clearBatchLayer();
      Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.NONE);
      this.toggle = !this.toggle;
    }
  }
}