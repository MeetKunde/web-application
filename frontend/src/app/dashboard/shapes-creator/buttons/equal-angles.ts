/**
 * Module contains implementation of EqualAnglesComponent. This button is used to set equal angles.
 * 
 * @module Equal Angles Component
 */

import { Component } from '@angular/core';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-equal-angles',
  template: `
   <input type="image" class="icon-button" src="/static/imgs/EqualAnglesIcon.svg" (click)="isTrue() && onClick();" alt="Equal Angles">
    `,
  styleUrls: ['./../../dashboard.component.css']
})
export class EqualAnglesComponent {
  /** 
   * Function used in equal-angles.component template.
   * Check if it is currently not possible drawing some shape.
   * @ignore */
  public isTrue() {
    return Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE;
  }

  /** Empty function */
  constructor() { }

  /**
   * Function called after clicked on this component(button).
   * Start function {@link ComplexShapeCreator.chooseShapes} to select angle points.
   */
  onClick() {
    ComplexShapeCreator.chooseShapes("Choose First Angle", [[ShapeToSelect.EXISTING_POINT], [ShapeToSelect.EXISTING_POINT], [ShapeToSelect.EXISTING_POINT]],
      () => {
        let angle1 = ComplexShapeCreator.getChosenShapes();
        ComplexShapeCreator.chooseShapes("Choose Second Angle", [[ShapeToSelect.EXISTING_POINT], [ShapeToSelect.EXISTING_POINT], [ShapeToSelect.EXISTING_POINT]],
          () => {
            let angle2 = ComplexShapeCreator.getChosenShapes();
            CanvasManagerInterface.setEqualAnglesDependency(angle1[0][0], angle1[1][0], angle1[2][0], angle2[0][0], angle2[1][0], angle2[2][0]);
          });
      });
  }
}