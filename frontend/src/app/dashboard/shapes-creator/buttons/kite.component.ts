/**
 * Module contains implementation of KiteComponent. This button is used to create kite.
 * 
 * @module Kite Component
 */

import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';
import { AvailableTransformation, ComplexShapeCreator, DependeciesSetToSet, DragRangeType, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-kite',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/KiteIcon.svg" (click)="isTrue() && triggerModal(modalData1);" alt="Kite Creating">
  
  <ng-template #modalData1 let-modal>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Create Unfettered Kite</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec2')">Create Dependent Kite</button>
    </div>
  </div>
  </ng-template>
 
  <ng-template #modalData2 let-modal>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec3')">Based On Segment</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec4')">Based On 3 Points</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class KiteComponent {
  /** 
  * Variable used in kite.component template.
  * @ignore */
  @ViewChild("modalData2", { static: false }) modalData2: any;

  /** 
   * Function used in kite.component template.
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
   * or to ask for a type of base shape
   * @param content element with a question to display
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          ComplexShapeCreator.fullConfigurePolygon(
            [[0, -6.342], [-3.2, 0], [0, 4.342], [3.2, 0]],
            [],
            [],
            [1, 3],
            [AvailableTransformation.ALL_BASIC],
            [[1, 3, 2, 0]],
            [null],
            [DragRangeType.NONE],
            DependeciesSetToSet.KITE);
        }
        else if (res == "dec2") {
          this.triggerModal(this.modalData2);
        }
        else if (res == "dec3") {
          ComplexShapeCreator.chooseShapes("Choosing One Of Kite Sides", [[ShapeToSelect.SEGMENT, ShapeToSelect.SEGMENT_ENDS]],
            () => {
              let point_ids = ComplexShapeCreator.getChosenShapes();
              let fixedPointsIds: number[] = [];
              let fixedSidePoints: ([number, number])[] = [];

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
                [[0, -6.342], [-3.2, 0], [0, 4.342], [3.2, 0]],
                fixedPointsIds,
                fixedSidePoints,
                [0, 1],
                [AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR],
                [[0, 1, 2, 3]],
                [null],
                [DragRangeType.KITE],
                DependeciesSetToSet.KITE);
            });
        }
        else if (res == "dec4") {
          ComplexShapeCreator.chooseShapes("Choosing Three Of Kite Vertices", [[ShapeToSelect.EXISTING_POINT], [ShapeToSelect.EXISTING_POINT], [ShapeToSelect.EXISTING_POINT]],
            () => {
              let point_ids = ComplexShapeCreator.getChosenShapes();
              let p1 = Canvas.getShape(point_ids[0][0]);
              p1 = ComplexShapeCreator.toUnit([p1.getAttr('x'), p1.getAttr('y')]);
              let p2 = Canvas.getShape(point_ids[1][0]);
              p2 = ComplexShapeCreator.toUnit([p2.getAttr('x'), p2.getAttr('y')]);
              let p3 = Canvas.getShape(point_ids[2][0]);
              p3 = ComplexShapeCreator.toUnit([p3.getAttr('x'), p3.getAttr('y')]);

              if (ComplexShapeCreator.angleIsObtuse(p1, p2, p3)) {
                let p4: [number, number];

                if (Canvas.compareNumbers(p1[0] - p3[0], 0, 0.1)) {
                  p4 = [2 * p1[0] - p2[0], p2[1]];
                }
                else if (Canvas.compareNumbers(p1[1] - p3[1], 0, 0.1)) {
                  p4 = [p2[0], 2 * p1[1] - p2[1]];
                }
                else {
                  let a1 = (p3[1] - p1[1]) / (p3[0] - p1[0]);
                  let b1 = p3[1] - a1 * p3[0];
                  let a2 = (p3[0] - p1[0]) / (p1[1] - p3[1]);
                  let b2 = p2[1] - a2 * p2[0];

                  let midx = (b2 - b1) / (a1 - a2);
                  let midy = a1 * midx + b1;

                  p4 = [2 * midx - p2[0], 2 * midy - p2[1]];
                }
                let fixedPointsIds: number[] = [point_ids[0][0], point_ids[1][0], point_ids[2][0]]
                let fixedSidePoints: ([number, number])[] = [p1, p2, p3];
                ComplexShapeCreator.fullConfigurePolygon(
                  [p1, p2, p3, p4],
                  //[p2, p3, p4, p1],
                  [],
                  [],
                  //fixedPointsIds,
                  //fixedSidePoints,
                  [0, 1],
                  [AvailableTransformation.NONE],
                  [[0, 1, 2, 3]],
                  [null],
                  [DragRangeType.NONE],
                  DependeciesSetToSet.KITE);
              }
              else {
                alert("Bad Input! Points should represent obtuse angle of kite!");
              }
            });
        }
      });
  }
}
