/**
 * Module contains implementation of MidPerpendicularComponent. This button is used to create mid-perpendicular.
 * 
 * @module Mid-Perpendicular Component
 */

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-mid-perpendicular',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/MidPerpendicularIcon.svg" (click)="isTrue() && onClick();" alt="MidPerpendicular Creating">
   `,
   styleUrls: ['./../../dashboard.component.css']
  })
export class MidPerpendicularComponent {
  /** 
   * Function used in mid-perpendicular.component template.
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
    ComplexShapeCreator.chooseShapes("Creating Mid Perpendicular", [[ShapeToSelect.SEGMENT, ShapeToSelect.SEGMENT_ENDS]],
      () => {
        let ids = ComplexShapeCreator.getChosenShapes();
        if (ids[0].length == 2) {
          let ends = ids[0];
          CanvasManagerInterface.createSegmentMidPerpendicularWithEnds(ends[0], ends[1]);
        }
        else {
          CanvasManagerInterface.createSegmentMidPerpendicularWithId(ids[0][0]);
        }
      });
  }
}