/**
 * Module contains implementation of SetLengthComponent. This button is used to set length.
 * 
 * @module Set Length Component
 */

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ViewChild } from '@angular/core';
import { Canvas } from '../../canvas';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-set-length',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/SegmentLengthIcon.svg" (click)="isTrue() && onClick();" alt="Segment Length">

  <ng-template #modalData let-modal>
  <div class="modal-header modal-title">Enter Segment Length</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <input [(ngModel)]="length" class="form-control" id="segment-length" placeholder="Enter Segment Length">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Enter Segment Length</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class SetLengthComponent {
  /** 
   * Variable used in set-length.component template.
   * @ignore */
  @ViewChild("modalData", { static: false }) content: any;

  /**
   * Variable used to get information from modal.
   * @ignore */
  length: string = "";

  /** 
   * Function used in set-length.component template.
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
   * Start function {@link ComplexShapeCreator.chooseShapes} to select 2 points.
   */
  onClick() {
    ComplexShapeCreator.chooseShapes("Setting Segment Length", [[ShapeToSelect.SEGMENT, ShapeToSelect.SEGMENT_ENDS]],
      () => {
        this.triggerModal(this.content);
      });
  }

  /**
   * Function called to get value of length.
   * @param content element with a question to display
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          let ids = ComplexShapeCreator.getChosenShapes();
          if (ids[0].length == 2) {
            let ends = ids[0];
            CanvasManagerInterface.setLengthValue(ends[0], ends[1], this.length);
          }
          else {
            CanvasManagerInterface.setSegmentLengthValue(ids[0][0], this.length);
          }
        }
      });
  }
}
