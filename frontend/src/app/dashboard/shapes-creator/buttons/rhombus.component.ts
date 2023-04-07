/**
 * Module contains implementation of RhombusComponent. This button is used to create rhombus.
 * 
 * @module Rhombus Component
 */

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';
import { AvailableTransformation, ComplexShapeCreator, DependeciesSetToSet, DragRangeType, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';


@Component({
  selector: 'app-rhombus',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/RhombusIcon.svg" (click)="isTrue() && triggerModal(modalData);" alt="Rhombus Creating">
  
  <ng-template #modalData let-modal>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Create Unfettered Rhombus</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec2')">Create Dependent Rhombus</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class RhombusComponent {
  /** 
   * Function used in rhombus.component template.
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
   * Function called to ask for a type of creating shape(unfettered or on base other just created shapes)
   * @param content element with a question to display
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          ComplexShapeCreator.fullConfigurePolygon(
            [[0, -5.542], [-3.2, 0], [0, 5.542], [3.2, 0]],
            [],
            [],
            [1, 3],
            [AvailableTransformation.TRANSLATE | AvailableTransformation.SCALE | AvailableTransformation.ROTATE],
            [[0, 1, 2, 3]],
            [null],
            [DragRangeType.NONE],
            DependeciesSetToSet.RHOMBUS);
        }
        else if (res == "dec2") {
          ComplexShapeCreator.chooseShapes("Choosing One Of Rhombus Sides", [[ShapeToSelect.SEGMENT, ShapeToSelect.SEGMENT_ENDS]],
            () => {
              let point_ids = ComplexShapeCreator.getChosenShapes();
              let fixedPointsIds: number[] = [];
              let fixedSidePoints: [number, number][] = [];

              if (point_ids[0].length == 2) {
                let ends = point_ids[0];
                let end1 = Canvas.getShape(ends[0]);
                let end2 = Canvas.getShape(ends[1]);
                fixedPointsIds = ends;
                fixedSidePoints = [[end1.getAttr('x'), end1.getAttr('y')], [end2.getAttr('x'), end2.getAttr('y')]];
              }
              else {
                let segment_points = Canvas.getShape(point_ids[0][0]).getAttr('points');
                fixedPointsIds = Canvas.getSegmentEnds(point_ids[0][0]);
                fixedSidePoints = [[segment_points[0], segment_points[1]], [segment_points[2], segment_points[3]]];
              }
              ComplexShapeCreator.fullConfigurePolygon(
                [[-3.2, 0], [0, 5.542], [3.2, 0], [0, -5.542]],
                fixedPointsIds,
                fixedSidePoints,
                [3, 0],
                [AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR],
                [[0, 1, 2, 3]],
                [null],
                [DragRangeType.RHOMBUS],
                DependeciesSetToSet.RHOMBUS);
            });
        }
      });
  }
}
