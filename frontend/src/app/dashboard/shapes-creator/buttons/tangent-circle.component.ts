/**
 * Module contains implementation of TangentCircleComponent. This button is used to create tangent circle.
 * 
 * @module Tangent Circle Component
 */

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-tangent-circle',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/TangentCircleToLineIcon.svg" (click)="isTrue() && triggerModal(modalData);" alt="Tangent Circle Creating">

  <ng-template #modalData let-modal>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Create Line Tangent To Circle</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec2')">Create Circle Tangent To Line</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec3')">Create Circle Tangent To Circle Externally</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec4')">Create Circle Tangent To Circle Internally</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class TangentCircleComponent {
  /** 
   * Function used in tangent-circle.component template.
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
   * Start function {@link ComplexShapeCreator.chooseShapes} to select point and segment.
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          ComplexShapeCreator.chooseShapes("Creating Tangent Line To Circle", [[ShapeToSelect.EXISTING_POINT, ShapeToSelect.NEW_POINT_CLICK_ON_CIRCLE], [ShapeToSelect.CIRCLE]],
            () => {
              let ids = ComplexShapeCreator.getChosenShapes();
              CanvasManagerInterface.createTangentLine(ids[1][0], ids[0][0]);
            });
        }
        else if (res == "dec2") {
          ComplexShapeCreator.chooseShapes("Creating Tangent Circle To Line", [[ShapeToSelect.EXISTING_POINT, ShapeToSelect.NEW_POINT_CLICK_ON_CANVAS, ShapeToSelect.NEW_POINT_CLICK_ON_SEGMENT, ShapeToSelect.NEW_POINT_CLICK_ON_CIRCLE], [ShapeToSelect.SEGMENT]],
            () => {
              let ids = ComplexShapeCreator.getChosenShapes();
              CanvasManagerInterface.createTangentCircleToLine(ids[0][0], ids[1][0]);
            });
        }
        else if (res == "dec3") {
          ComplexShapeCreator.chooseShapes("Creatig Tangent Circle To Circle", [[ShapeToSelect.CIRCLE], [ShapeToSelect.EXISTING_POINT, ShapeToSelect.NEW_POINT_CLICK_ON_CANVAS, ShapeToSelect.NEW_POINT_CLICK_ON_CIRCLE, ShapeToSelect.NEW_POINT_CLICK_ON_SEGMENT]],
            () => {
              let ids = ComplexShapeCreator.getChosenShapes();
              CanvasManagerInterface.createTangentCircleToCircle(ids[0][0], ids[1][0], true);
            });
        }
        else if (res == "dec4") {
          ComplexShapeCreator.chooseShapes("Creatig Tangent Circle To Circle", [[ShapeToSelect.CIRCLE], [ShapeToSelect.EXISTING_POINT, ShapeToSelect.NEW_POINT_CLICK_ON_CANVAS, ShapeToSelect.NEW_POINT_CLICK_ON_CIRCLE, ShapeToSelect.NEW_POINT_CLICK_ON_SEGMENT]],
            () => {
              let ids = ComplexShapeCreator.getChosenShapes();
              CanvasManagerInterface.createTangentCircleToCircle(ids[0][0], ids[1][0], false);
            });
        }
      });
  }
}