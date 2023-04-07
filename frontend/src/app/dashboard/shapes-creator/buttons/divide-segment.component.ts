/**
 * Module contains implementation of DivideSegmentComponent. This button is used to divide segment.
 * 
 * @module Divide Segment Component
 */

import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-divide-segment',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/DivideSegmentIcon.svg" (click)="isTrue() && onClick();" alt="Divide Segment">

  <ng-template #modalData let-modal>
  <div class="modal-header modal-title">Enter Number Of Parts</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <input [(ngModel)]="n" type="number" class="form-control" id="parts-number" placeholder="Enter Parts Number">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Divide Segment</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class DivideSegmentComponent {
  /** 
  * Variable used in divide-segment.component template.
  * @ignore */
  @ViewChild("modalData", { static: false }) modalData: any;

  /** 
   * Variable used in divide-segment.component template.
   * @ignore */
  public n: string = "";

  /** 
   * Function used in divide-segment.component template.
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
   * Start function {@link ComplexShapeCreator.chooseShapes} to select segment or segment ends.
   */
  onClick() {
    ComplexShapeCreator.chooseShapes("Dividing Segment", [[ShapeToSelect.SEGMENT, ShapeToSelect.SEGMENT_ENDS]],
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
            if (ids[0].length == 2) {
              let ends = ids[0];
              CanvasManagerInterface.divideSegmentWithEnds(ends[0], ends[1], N);
            }
            else {
              CanvasManagerInterface.divideSegmentWithId(ids[0][0], N);
            }
          }
        }
      });
  }
}