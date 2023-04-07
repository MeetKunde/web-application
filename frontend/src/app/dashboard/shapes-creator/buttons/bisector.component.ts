/**
 * Module contains implementation of BisectorComponent. This button is used to create bisector of an angle.
 * 
 * @module Bisector Component
 */

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ViewChild } from '@angular/core';
import { Canvas } from '../../canvas';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-bisector',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/BisectorIcon.svg" (click)="isTrue() && onClick();" alt="Bisector Creating">

  <ng-template #modalData let-modal>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Create Bisector Of Convex Angle</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec2')">Create Bisector Of Concave Angle</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class BisectorComponent {
  /** 
   * Variable used in bisector.component template.
   * @ignore */
  @ViewChild("modalData", { static: false }) content: any;

  /** 
   * Array with point IDs get from ComplexShapeCreator after done selection.
   * @ignore */
  private points!: ([number] | [number, number])[];

  /** 
   * Function used in bisector.component template.
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
   * Start function {@link ComplexShapeCreator.chooseShapes} to select 3 points.
   */
  onClick() {
    //let pointTypes = [ShapeToSelect.EXISTING_POINT, ShapeToSelect.NEW_POINT_CLICK_ON_CANVAS, ShapeToSelect.NEW_POINT_CLICK_ON_SEGMENT, ShapeToSelect.NEW_POINT_CLICK_ON_CIRCLE]
    let pointTypes = [ShapeToSelect.EXISTING_POINT];
    ComplexShapeCreator.chooseShapes("Creatig Bisector Line", [pointTypes, pointTypes, pointTypes],
      () => {
        this.points = ComplexShapeCreator.getChosenShapes();
        this.triggerModal(this.content);
      });
  }

  /**
   * Function called after selecting given shapes.
   * Question about the type of bisector created: bisector of a convex angle or bisector of a concave angle.
   * @param content element with a question to display
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        let ids = ComplexShapeCreator.getChosenShapes();
        if (res == "dec1") {
          CanvasManagerInterface.createBisectorLine(ids[0][0], ids[1][0], ids[2][0], true);
        }
        else if (res == "dec2") {
          CanvasManagerInterface.createBisectorLine(ids[0][0], ids[1][0], ids[2][0], false);
        }
      });
  }
}