/**
 * Module contains implementation of MidSegmentComponent. This button is used to create mid-segment.
 * 
 * @module Mid-Segment Component
 */

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-mid-segment',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/MidSegmentIcon.svg" (click)="isTrue() && onClick();" alt="Mid Segment Creating">
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class MidSegmentComponent {
  /** 
   * Function used in mid-segment.component template.
   * Check if it is currently not possible drawing some shape.
   * @ignore */
  public isTrue() {
    return Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE;
  }

  /** Empty function */
  constructor() { }

  /**
   * Function called after clicked on this component(button).
   * Start function {@link ComplexShapeCreator.chooseShapes} to select segments ends.
   */
  onClick() {
    ComplexShapeCreator.chooseShapes("Creating Mid Segment", [[ShapeToSelect.SEGMENT_ENDS, ShapeToSelect.SEGMENT], [ShapeToSelect.SEGMENT_ENDS, ShapeToSelect.SEGMENT]],
      () => {
        let ids = ComplexShapeCreator.getChosenShapes();
        if(ids[0].length == 2 && ids[1].length == 2) {
          let ends1 = ids[0];
          let ends2 = ids[1];
          CanvasManagerInterface.createMidSegmentWithArmEnds(ends1[0], ends1[1], ends2[0], ends2[1]);
        } 
        else if(ids[0].length == 2) {
          let ends = ids[0];
          CanvasManagerInterface.createMidSegmentWithMix(ids[1][0], ends[0], ends[1]);
        }
        else if(ids[1].length == 2) {
          let ends = ids[1];
          CanvasManagerInterface.createMidSegmentWithMix(ids[0][0], ends[0], ends[1]);
        }
        else {
          CanvasManagerInterface.createMidSegmentWithArmIds(ids[0][0], ids[1][0]);
        }
      });
  }
}