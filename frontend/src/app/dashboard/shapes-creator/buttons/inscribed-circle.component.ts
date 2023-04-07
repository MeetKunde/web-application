/**
 * Module contains implementation of InscribedCircleComponent. This button is used to create inscribed circle in polygon.
 * 
 * @module Inscribed Circle Component
 */

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';
import { ComplexShapeCreator, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-inscribed-circle',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/InscribedCircleIcon.svg" (click)="isTrue() && triggerModal(modalData);" alt="Inscribed Circle Creating">

  <ng-template #modalData let-modal>
  <div class="modal-header modal-title">Enter Number Of Polygon Vertices</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
       <input [(ngModel)]="vertices" type="number" class="form-control" id="vertices-number" placeholder="Enter Vertices Number">
       <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Create Inscribed Circle</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
  })
export class InscribedCircleComponent {
  /**
   * Variable used to get information from modal.
   * @ignore */
  vertices: string = "";

  /** 
   * Function used in inscribed-circle.component template.
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
   * Question about number of polygon vertices in which we inscribe a circle 
   * Start function {@link ComplexShapeCreator.chooseShapes} to select N points.
   * @param content element with a question to display
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          let n = parseInt(this.vertices);
          if (n > 2) {
            let shapesToSelect: (ShapeToSelect[])[] = []
            for (let i = 0; i < n; i++) {
              shapesToSelect.push([ShapeToSelect.EXISTING_POINT])
            }
            ComplexShapeCreator.chooseShapes("Creating Inscribed Circle on Polygon", shapesToSelect,
              () => {
                let ids = ComplexShapeCreator.getChosenShapes();
                CanvasManagerInterface.createInscribedCircle(ids.map((element) => { return element[0]; }));
              });
          }
        }
      });
  }
}
