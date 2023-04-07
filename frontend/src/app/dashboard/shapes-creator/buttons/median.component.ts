/**
 * Module contains implementation of MedianComponent. This button is used to create median.
 * 
 * @module Median Component
 */

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-median',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/MedianIcon.svg" (click)="isTrue() && onClick();" alt="Median Creating">
   `,
   styleUrls: ['./../../dashboard.component.css']
  })
export class MedianComponent {
  /** 
   * Function used in median.component template.
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
    ComplexShapeCreator.chooseShapes("Creating Median", [[ShapeToSelect.SEGMENT, ShapeToSelect.SEGMENT_ENDS], [ShapeToSelect.EXISTING_POINT]],
      () => {
        let ids = ComplexShapeCreator.getChosenShapes();
        if (ids[0].length == 2) {
          let ends = ids[0];
          CanvasManagerInterface.createMedianwithBaseEnds(ends[0], ends[1], ids[1][0]);
        }
        else {
          CanvasManagerInterface.createMedianWithBaseId(ids[0][0], ids[1][0]);
        }
      });
  }
}