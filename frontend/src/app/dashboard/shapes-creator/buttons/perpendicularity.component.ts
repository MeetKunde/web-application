/**
 * Module contains implementation of PerpendicularityComponent. This button is used to create perpendicular line or set perpendicularity dependency.
 * 
 * @module Perpendicularity Component
 */

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { Canvas, ComplexShapeEnum } from '../../canvas';
import { ComplexShapeCreator } from '../complex-shape-creator/complex-shapes-creator';
import { ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-perpendicularity',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/PerpendicularityIcon.svg" (click)="isTrue() && triggerModal(modalData);" alt="Perpendicularity Creating">

  <ng-template #modalData let-modal>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Create Perpendicular Line</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec2')">Set Perpendicularity Dependency</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class PerpendicularityComponent {
  /** 
     * Function used in perpendicularity.component template.
     * Check if it is currently not possible drawing some shape.
     * @ignore */
  public isTrue() {
    return Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE;
  }

  /**
   * Initializing ModalService.
   * @param modalService instance of ModalService
   */
  constructor(private modalService: NgbModal) { }

  /**
   * Function called after clicked on this component(button).
   * Question about the type of action: create new perpendicular line or set perpendicularity dependency.
   * Start function {@link ComplexShapeCreator.chooseShapes} to select segment and point or 2 segments.
   * @param content element with a question to display
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          Canvas.setCurrentlyComplexShape(ComplexShapeEnum.PERPENDICULAR_LINE);
          ComplexShapeCreator.chooseShapes("Creating Perpendicular Line", [[ShapeToSelect.SEGMENT], [ShapeToSelect.EXISTING_POINT, ShapeToSelect.NEW_POINT_CLICK_ON_CANVAS, ShapeToSelect.NEW_POINT_CLICK_ON_SEGMENT, ShapeToSelect.NEW_POINT_CLICK_ON_CIRCLE]],
            () => {
              let ids = ComplexShapeCreator.getChosenShapes();
              CanvasManagerInterface.createPerpendicularLineToLine(ids[0][0], ids[1][0]);
            });
        }
        else if (res == "dec2") {
          ComplexShapeCreator.chooseShapes("Setting Perpendicularity Dependency", [[ShapeToSelect.SEGMENT], [ShapeToSelect.SEGMENT]],
            () => {
              let ids = ComplexShapeCreator.getChosenShapes();
              CanvasManagerInterface.setPerpendicularityDependency(ids[0][0], ids[1][0]);
            });
        }
      });
  }
}