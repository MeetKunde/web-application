/**
 * Module contains implementation of TriangleComponent. This button is used to create specific triangle.
 * 
 * @module Triangle Component
 */

import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';
import { AvailableTransformation, ComplexShapeCreator, DependeciesSetToSet, DragRangeType, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-triangle',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/TriangleIcon.svg" (click)="isTrue() && triggerModal(modalData1);" alt="Triangle Creating">

  <ng-template #modalData1 let-modal>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Create Unfettered Triangle</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec2')">Create Dependent Triangle</button>
    </div>
  </div>
  </ng-template>
    
  <ng-template #modalData2 let-modal>
  <div class="modal-header modal-title">Choose Triangle Type</div>
  <table class="table modal-body" style="background-color: #EBEBEB;">
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Scalene</th>
        <th scope="col">Isosceles</th>
        <th scope="col">Equilateral</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Acute</th>
        <td><button type="button" class="btn modal-btn" (click)="modal.dismiss('dec3')">Choose</button></td>
        <td><button type="button" class="btn modal-btn" (click)="modal.dismiss('dec4')">Choose</button></td>
        <td><button type="button" class="btn modal-btn" (click)="modal.dismiss('dec5')">Choose</button></td>
      </tr>
      <tr>
        <th scope="row">Right</th>
        <td><button type="button" class="btn modal-btn" (click)="modal.dismiss('dec6')">Choose</button></td>
        <td><button type="button" class="btn modal-btn" (click)="modal.dismiss('dec7')">Choose</button></td>
        <td>X</td>
      </tr>
      <tr>
        <th scope="row">Obtuse</th>
        <td><button type="button" class="btn modal-btn" (click)="modal.dismiss('dec8')">Choose</button></td>
        <td><button type="button" class="btn modal-btn" (click)="modal.dismiss('dec9')">Choose</button></td>
        <td>X</td>
      </tr>
    </tbody>
  </table>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class TriangleComponent {
  /** 
   * Variable used in triangle.component template.
   * @ignore */
  @ViewChild("modalData2", { static: false }) modalData2: any;

  /** 
   * Variable used in choosing operation type.
   * @ignore */
  private unfetteredShape!: boolean;

  /** 
   * Function used in triangle.component template.
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
   * or to ask for a type of triangle to create
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
              [[-4, -4], [4, -4], [-1, 4]],
              [],
              [],
              [0, 1],
              [AvailableTransformation.ALL_BASIC],
              [[0, 1]],
              [ComplexShapeCreator.triangleIsAcute],
              [DragRangeType.NONE],
              DependeciesSetToSet.NONE);
          }
          else {
            this.getFixedSidePoints((points: number[][]) => {
              ComplexShapeCreator.fullConfigurePolygon(
                [[-4, -4], [4, -4], [-1, 4]],
                [],
                [[points[0][0], points[0][1]], [points[1][0], points[1][1]]],
                [0, 1],
                [AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR],
                [[0, 1, 2]],
                [ComplexShapeCreator.triangleIsAcute],
                [DragRangeType.NONE],
                DependeciesSetToSet.NONE);
            });
          }
        }
        else if (res == "dec4") {
          if (this.unfetteredShape) {
            ComplexShapeCreator.fullConfigurePolygon(
              [[-4, -4], [4, -4], [0, 4]],
              [],
              [],
              [0, 1],
              [AvailableTransformation.ALL_BASIC],
              [[0, 1]],
              [ComplexShapeCreator.triangleIsAcute],
              [DragRangeType.NONE],
              DependeciesSetToSet.ISOSCELES_ACUTE_TRIANGLE);
          }
          else {
            this.getFixedSidePoints((points: number[][]) => {
              ComplexShapeCreator.fullConfigurePolygon(
                [[-4, -4], [4, -4], [0, 4]],
                [],
                [[points[0][0], points[0][1]], [points[1][0], points[1][1]]],
                [0, 1],
                [AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR_X | AvailableTransformation.CHANGE_SIDE, AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR | AvailableTransformation.CHANGE_SIDE, AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR | AvailableTransformation.CHANGE_SIDE],
                [[0, 1, 2], [0, 2, 1, 0], [0, 2, 1, 2]],
                [ComplexShapeCreator.triangleIsAcute, ComplexShapeCreator.triangleIsAcute, ComplexShapeCreator.triangleIsAcute],
                [DragRangeType.ISOSCELES_TRIANGLE_BASE, DragRangeType.ISOSCELES_TRIANGLE_ARM, DragRangeType.ISOSCELES_TRIANGLE_ARM],
                DependeciesSetToSet.ISOSCELES_ACUTE_TRIANGLE);
            });
          }
        }
        else if (res == "dec5") {
          if (this.unfetteredShape) {
            ComplexShapeCreator.fullConfigurePolygon(
              [[-4, -3.464], [4, -3.464], [0, 3.464]],
              [],
              [],
              [0, 1],
              [AvailableTransformation.TRANSLATE | AvailableTransformation.SCALE_XY | AvailableTransformation.ROTATE],
              [[0, 1]],
              [null],
              [DragRangeType.NONE],
              DependeciesSetToSet.EQUILATERAL_TRIANGLE);
          }
          else {
            this.getFixedSidePoints((points: number[][]) => {
              ComplexShapeCreator.fullConfigurePolygon(
                [[-4, -3.464], [4, -3.464], [0, 3.464]],
                [],
                [[points[0][0], points[0][1]], [points[1][0], points[1][1]]],
                [0, 1],
                [AvailableTransformation.MIRROR_X],
                [[0, 1]],
                [null],
                [DragRangeType.NONE],
                DependeciesSetToSet.EQUILATERAL_TRIANGLE);
            });
          }
        }
        else if (res == "dec6") {
          if (this.unfetteredShape) {
            ComplexShapeCreator.fullConfigurePolygon(
              [[-5.47, -2.56], [4.8, -2.56], [0.96, 2.42]],
              [],
              [],
              [0, 1],
              [AvailableTransformation.TRANSLATE | AvailableTransformation.SCALE_XY | AvailableTransformation.ROTATE],
              [[0, 1]],
              [null],
              [DragRangeType.NONE],
              DependeciesSetToSet.SCALENE_RIGHT_TRIANGLE);
          }
          else { 
            this.getFixedSidePoints((points: number[][]) => {
              ComplexShapeCreator.fullConfigurePolygon(
                [[-1.75, 0], [2, 0], [2, 3]],
                [],
                [[points[0][0], points[0][1]], [points[1][0], points[1][1]]],
                [0, 1],
                [AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR_X | AvailableTransformation.CHANGE_SIDE, AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR | AvailableTransformation.CHANGE_SIDE],
                [[0, 1, 2], [2, 1, 0]],
                [null, null],
                [DragRangeType.RIGHT_TRIANGLE, DragRangeType.RIGHT_TRIANGLE_CATHETUS],
                DependeciesSetToSet.SCALENE_RIGHT_TRIANGLE);
            });
          }
        }
        else if (res == "dec7") {
          if (this.unfetteredShape) {
            ComplexShapeCreator.fullConfigurePolygon(
              [[-5, -2.6], [5, -2.6], [0, 2.4]],
              [],
              [],
              [0, 1],
              [AvailableTransformation.TRANSLATE | AvailableTransformation.SCALE_XY | AvailableTransformation.ROTATE],
              [[0, 1]],
              [null],
              [DragRangeType.NONE],
              DependeciesSetToSet.ISOSCELES_RIGHT_TRIANGLE);
          }
          else {
            this.getFixedSidePoints((points: number[][]) => {
              ComplexShapeCreator.fullConfigurePolygon(
                [[-5, -2.6], [5, -2.6], [0, 2.4]],
                [],
                [[points[0][0], points[0][1]], [points[1][0], points[1][1]]],
                [0, 1],
                [AvailableTransformation.MIRROR_X | AvailableTransformation.CHANGE_SIDE, AvailableTransformation.MIRROR | AvailableTransformation.MIRROR_X | AvailableTransformation.CHANGE_SIDE],
                [[0, 1], [1, 2]],
                [null, null],
                [DragRangeType.NONE, DragRangeType.NONE],
                DependeciesSetToSet.ISOSCELES_RIGHT_TRIANGLE);
            });
          }
        }
        else if (res == "dec8") {
          if (this.unfetteredShape) {
            ComplexShapeCreator.fullConfigurePolygon(
              [[0, -3.2], [-5.8, -3.2], [4.2, 2.6]],
              [],
              [],
              [0, 1],
              [AvailableTransformation.ALL_BASIC],
              [[0, 1]],
              [ComplexShapeCreator.triangleIsObtuse],
              [DragRangeType.NONE],
              DependeciesSetToSet.NONE);
          }
          else {
            this.getFixedSidePoints((points: number[][]) => {
              ComplexShapeCreator.fullConfigurePolygon(
                [[0, -3.2], [-5.8, -3.2], [4.2, 2.6]],
                [],
                [[points[0][0], points[0][1]], [points[1][0], points[1][1]]],
                [0, 1],
                [AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR],
                [[0, 1, 2]],
                [ComplexShapeCreator.triangleIsObtuse],
                [DragRangeType.NONE],
                DependeciesSetToSet.NONE);
            });
          }
        }
        else if (res == "dec9") {
          if (this.unfetteredShape) {
            ComplexShapeCreator.fullConfigurePolygon(
              [[-6, 2], [5, 2], [-0.5, 5]],
              [],
              [],
              [0, 1],
              [AvailableTransformation.TRANSLATE | AvailableTransformation.SCALE | AvailableTransformation.ROTATE],
              [[0, 1]],
              [ComplexShapeCreator.triangleIsObtuse],
              [DragRangeType.NONE],
              DependeciesSetToSet.OBTUSE_ISOSCELES_TRIANGLE);
          }
          else {
            this.getFixedSidePoints((points: number[][]) => {
              ComplexShapeCreator.fullConfigurePolygon(
                [[-6, 2], [5, 2], [-0.5, 5]],
                [],
                [[points[0][0], points[0][1]], [points[1][0], points[1][1]]],
                [0, 1],
                [AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR | AvailableTransformation.CHANGE_SIDE, AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR | AvailableTransformation.CHANGE_SIDE, AvailableTransformation.MOVING_POINT | AvailableTransformation.MIRROR | AvailableTransformation.CHANGE_SIDE],
                [[0, 1, 2], [0, 2, 1, 0], [0, 2, 1, 2]],
                [ComplexShapeCreator.triangleIsObtuse, ComplexShapeCreator.triangleIsObtuse, ComplexShapeCreator.triangleIsObtuse],
                [DragRangeType.ISOSCELES_TRIANGLE_BASE, DragRangeType.ISOSCELES_TRIANGLE_ARM, DragRangeType.ISOSCELES_TRIANGLE_ARM],
                DependeciesSetToSet.OBTUSE_ISOSCELES_TRIANGLE);
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
    ComplexShapeCreator.chooseShapes("Choosing One Of Triangle Sides", [[ShapeToSelect.SEGMENT, ShapeToSelect.SEGMENT_ENDS]],
      () => {
        let point_ids = ComplexShapeCreator.getChosenShapes();
        let points: (number[])[] = [];

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
