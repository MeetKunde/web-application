/**
 * Module contains implementation of EscribedCircleComponent. This button is used to create escribed circle on polygon.
 * 
 * @module Escribed Circle Component
 */

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-escribed-circle',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/EscribedCircleIcon.svg" (click)="isTrue() && onClick();" alt="Escribed Circle Creating">
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class EscribedCircleComponent {
  /** 
   * Function used in escribed-circle.component template.
   * Check if it is currently not possible drawing some shape.
   * @ignore */
  public isTrue() {
    return Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE;
  }

  /** Empty function */
  constructor() { }

  /**
   * Function called after clicked on this component(button).
   * Start function {@link ComplexShapeCreator.chooseShapes} to select segment or segment ends.
   */
   onClick() {
    ComplexShapeCreator.chooseShapes("Creating Escribed Circle", [[ShapeToSelect.SEGMENT, ShapeToSelect.SEGMENT_ENDS], [ShapeToSelect.EXISTING_POINT]],
      () => {
        let ids = ComplexShapeCreator.getChosenShapes();
        if(ids[0].length == 2) {
          CanvasManagerInterface.createEscribedCircleWithSideEnds(ids[0][0], ids[0][1], ids[1][0]);
        }
        else {
          CanvasManagerInterface.createEscribedCircleWithSideId(ids[0][0], ids[1][0]);
        }
      });
  }
}
