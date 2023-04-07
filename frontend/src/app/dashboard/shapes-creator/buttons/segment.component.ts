/**
 * Module contains implementation of SegmentComponent. This button is used to create segment.
 * 
 * @module Segment Component
 */

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-segment',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/SegmentIcon.svg" (click)="onClick();" [ngClass]="{'icon-button-clicked': toggle}" alt="Segment Creating">
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class SegmentComponent {
  /** 
   * Variable used to save state of this button.
   * @ignore */
  public toggle: boolean = false;

  /** Empty function */
  constructor() { }

  /**
   * Function called after clicked on this component(button).
   * Enable or disable drawing segments on {@link Canvas}.
   */
  onClick(): void {
    if (Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE) {
      Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.SEGMENT);
      this.toggle = !this.toggle;
    }
    else if (Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.SEGMENT) {
      Canvas.clearBatchLayer();
      Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.NONE);
      this.toggle = !this.toggle;
    }
  }
}