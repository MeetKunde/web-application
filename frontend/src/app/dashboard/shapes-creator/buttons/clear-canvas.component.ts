/**
 * Module contains implementation of ClearCanvasComponent. This button is used to clear canvas and delete all data.
 * 
 * @module Clear Canvas Component
 */

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-clear-canvas',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/DeleteIcon.svg" (click)="isTrue() && triggerModal(modalData);" alt="Clear Canvas">

  <ng-template #modalData let-modal>
  <div class="modal-header modal-title">Are You Sure To Remove All?</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Yes. Remove All</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec2')">No</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class ClearCanvasComponent {
  /**
   * Initializing ModalService.
   * @param modalService instance of ModalService
   */
  constructor(private modalService: NgbModal) { }

  /** 
   * Function used in clear-canvas.component template.
   * Check if it is currently not possible drawing some shape.
   * @ignore */
  public isTrue() {
    return Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE;
  }

  /**
   * Function called after clicked on this component(button).
   * Requesting confirmation to remove everything from {@link Canvas} 
   * @param content element with a question to display
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          Canvas.reinit();
        }
        else if (res == "dec2") { }
      });
  }
}
