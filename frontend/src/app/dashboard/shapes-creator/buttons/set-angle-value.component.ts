/**
 * Module contains implementation of SetAngleValueComponent. This button is used to set angle value.
 * 
 * @module Set Angle Value Component
 */

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ViewChild } from '@angular/core';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';
import { Canvas } from '../../canvas';
import { AngleTypeEnum, CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-set-angle-value',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/AngleValueIcon.svg" (click)="isTrue() && onClick();" alt="Angle Value">

  <ng-template #modalData let-modal>
  <div class="modal-header modal-title">Enter Angle Value</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <input [(ngModel)]="value" class="form-control" id="angle-value" placeholder="Enter Angle Value">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" [(ngModel)]="angleType" id="angleType1" value="option1" name="angleType" checked>
        <label class="form-check-label" for="inlineCheckbox1">Convex Angle</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" [(ngModel)]="angleType" id="angleType2" value="option2" name="angleType">
        <label class="form-check-label" for="inlineCheckbox2">Concave Angle</label>
      </div>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Enter Angle Value</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class SetAngleValueComponent {
  /** 
   * Variable used in set-angle-value.component template.
   * @ignore */
  @ViewChild("modalData", { static: false }) content: any;

  /**
   * Variable used to get information from modal.
   * @ignore */
  value: string = "";
  angleType: string = "option1";

  /** 
   * Function used in set-angle-value.component template.
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
    ComplexShapeCreator.chooseShapes("Setting Angle Value", [[ShapeToSelect.EXISTING_POINT], [ShapeToSelect.EXISTING_POINT], [ShapeToSelect.EXISTING_POINT]],
      () => {
        this.triggerModal(this.content);
      });
  }

  /**
   * Function called to get value of angle and ask whether angle is concave or convex.
   * @param content element with a question to display
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          let t;
          if (this.angleType == "option1") {
            t = AngleTypeEnum.CONVEX;
          }
          else {
            t = AngleTypeEnum.CONCAVE;
          }

          let ids = ComplexShapeCreator.getChosenShapes();
          CanvasManagerInterface.setAngleValue(ids[0][0], ids[1][0], ids[2][0], t, this.value);
        }
      });
  }
}
