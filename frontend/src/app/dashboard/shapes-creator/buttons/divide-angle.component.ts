/**
 * Module contains implementation of DivideAngleComponent. This button is used to divide angle.
 * 
 * @module Divide Angle Component
 */

import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-divide-angle',
  template: `
   <input type="image" class="icon-button" src="/static/imgs/DivideAngleIcon.svg" (click)="isTrue() && onClick();" alt="Divide Angle">
 
  <ng-template #modalData let-modal>
  <div class="modal-header modal-title">Enter Number Of Parts</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <input [(ngModel)]="n" type="number" class="form-control" id="parts-number" placeholder="Enter Parts Number">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" [(ngModel)]="angleType" id="angleType1" value="option1" name="angleType" checked>
        <label class="form-check-label" for="inlineCheckbox1">Convex Angle</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" [(ngModel)]="angleType" id="angleType2" value="option2" name="angleType">
        <label class="form-check-label" for="inlineCheckbox2">Concave Angle</label>
      </div>
     <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Divide Angle</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class DivideAngleComponent {
  /** 
  * Variable used in divide-angle.component template.
  * @ignore */
  @ViewChild("modalData", { static: false }) modalData: any;

  /** 
   * Variable used in divide-angle.component template.
   * @ignore */
  public n: string = "";
  angleType: string = "option1";

  /** 
   * Function used in divide-angle.component template.
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
   * Start function {@link ComplexShapeCreator.chooseShapes} to select angle points.
   */
  onClick() {
    ComplexShapeCreator.chooseShapes("Dividing Angle", [[ShapeToSelect.EXISTING_POINT], [ShapeToSelect.EXISTING_POINT], [ShapeToSelect.EXISTING_POINT]],
      () => {
        this.triggerModal(this.modalData);
      });
  }

  /**
    * Function called after selecting given shapes.
    * Question about the number of parts to create.
    * @param content element with a question to display
    */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          let N = parseInt(this.n);
          if (N > 1) {
            let ids = ComplexShapeCreator.getChosenShapes();
            CanvasManagerInterface.divideAngle(ids[0][0], ids[1][0], ids[2][0], this.angleType == "option1", N);
          }
        }
      });
  }
}