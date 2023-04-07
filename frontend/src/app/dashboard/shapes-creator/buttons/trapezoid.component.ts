/**
 * Module contains implementation of TrapezoidComponent. This button is used to create specific trapezoid.
 * 
 * @module Trapezoid Component
 */

import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';
import { AvailableTransformation, ComplexShapeCreator, DependeciesSetToSet, DragRangeType, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-trapezoid',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/TrapezoidIcon.svg" (click)="isTrue() && triggerModal(modalData1);" alt="Trapezoid Creating">
 
  <ng-template #modalData1 let-modal>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Create Unfettered Trapezoid</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec2')" disabled>Create Dependent Trapezoid</button>
    </div>
  </div>
  </ng-template>
     
  <ng-template #modalData2 let-modal>
  <div class="modal-header modal-title">Choose Trapezoid Type</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec3')">Scalene Trapezoid</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec4')">Isosceles Trapezoid</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec5')">Right Trapezoid</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class TrapezoidComponent {
  /**
   * Variable used in trapezoid.component template.
   * @ignore */
  @ViewChild("modalData2", { static: false }) modalData2: any;

  /** 
   * Variable used in choosing operation type.
   * @ignore */
  private unfetteredShape!: boolean;

  /** 
   * Function used in trapezoid.component template.
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
   * or to ask for a type of trapezeoid to create
   * @param content element with a question to display
   */
  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          this.unfetteredShape = true;
          this.triggerModal(this.modalData2);
        }
        else if (res == "dec2") {
          this.unfetteredShape = false;
          this.triggerModal(this.modalData2);
        }
        else if (res == "dec3") {
          if (this.unfetteredShape) {
            ComplexShapeCreator.fullConfigurePolygon(
              [[6.4, -2.8], [-6.4, -2.8], [-2.8, 2.8], [4.4, 2.8]],
              [],
              [],
              [0, 1],
              [AvailableTransformation.ALL_BASIC],
              [[0, 1, 2, 3]],
              [null],
              [DragRangeType.NONE],
              DependeciesSetToSet.SCALENE_TRAPEZOID);
          }
          else {
            alert("Currently Unavailable Function!");
            //this.getPoints((points: number[][]) => {
            //  ComplexShapeCreator.fullConfigurePolygon(vertices, [], [0, 1], [AvailableTransformation.ALL_BASIC], [[0, 1, 2, 3]], [null], [DragRangeType.NONE]);
            //});
          }
        }
        else if (res == "dec4") {
          if (this.unfetteredShape) {
            ComplexShapeCreator.fullConfigurePolygon(
              [[6.4, -2.8], [-6.4, -2.8], [-2.8, 2.8], [2.8, 2.8]],
              [],
              [],
              [0, 1],
              [AvailableTransformation.ALL_BASIC],
              [[0, 1, 2, 3]],
              [null],
              [DragRangeType.NONE],
              DependeciesSetToSet.ISOSCELES_TRAPEZOID);
          }
          else {
            this.getFixedSidePoints((points: number[][]) => {
              ComplexShapeCreator.fullConfigurePolygon(
                [[6.4, -2.8], [-6.4, -2.8], [-2.8, 2.8], [2.8, 2.8]],
                [],
                [[points[0][0], points[0][1]], [points[1][0], points[1][1]]],
                [0, 1],
                [AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR],
                [[0, 1, 2, 3]],
                [null],
                [DragRangeType.ISOSCELES_TRAPEZOID_BASE],
                DependeciesSetToSet.ISOSCELES_TRAPEZOID);
            });
          }
        }
        else if (res == "dec5") {
          if (this.unfetteredShape) {
            ComplexShapeCreator.fullConfigurePolygon(
              [[6.4, -2.8], [-6.4, -2.8], [-2.8, 2.8], [6.4, 2.8]],
              [],
              [],
              [0, 1],
              [AvailableTransformation.TRANSLATE | AvailableTransformation.SCALE | AvailableTransformation.ROTATE],
              [[0, 1, 2, 3]],
              [null],
              [DragRangeType.NONE],
              DependeciesSetToSet.RIGHT_TRAPEZOID);
          }
          else {
            this.getFixedSidePoints((points: number[][]) => {
              ComplexShapeCreator.fullConfigurePolygon(
                [[6.4, -2.8], [-6.4, -2.8], [-2.8, 2.8], [6.4, 2.8]],
                [],
                [[points[0][0], points[0][1]], [points[1][0], points[1][1]]],
                [0, 1],
                [AvailableTransformation.MIRROR | AvailableTransformation.MOVING_POINT],
                [[0, 1, 2, 3]],
                [null],
                [DragRangeType.RIGHT_TRAPEZOID_BASE],
                DependeciesSetToSet.RIGHT_TRAPEZOID);
            });
          }
        }
      });
  }

  /**
   * Function used in choosing fixed side points 
   * @param function_to_do_with_points function to apply after points choosing
   * @ignore */
  getFixedSidePoints(function_to_do_with_points: (points: number[][]) => void): void {
    ComplexShapeCreator.chooseShapes("Choosing One Of Trapezoid Sides", [[ShapeToSelect.SEGMENT, ShapeToSelect.SEGMENT_ENDS]],
      () => {
        let point_ids = ComplexShapeCreator.getChosenShapes();
        let points: number[][] = [];

        if (point_ids[0].length == 2) {
          let ends = point_ids[0];
          let end1 = Canvas.getShape(ends[0]);
          let end2 = Canvas.getShape(ends[1]);
          points = [[end1.getAttr('x'), end1.getAttr('y')], [end2.getAttr('x'), end2.getAttr('y')]];
        }
        else {
          let segment_points = Canvas.getShape(point_ids[0][0]).getAttr('points');
          points = [[segment_points[0], segment_points[1]], [segment_points[2], segment_points[3]]];
        }

        function_to_do_with_points.call(null, points);
      });
  }
}
