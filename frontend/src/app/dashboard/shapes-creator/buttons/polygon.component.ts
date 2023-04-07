/**
 * Module contains implementation of PolygonComponent. This button is used to create polygon.
 * 
 * @module Polygon Component
 */

import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Canvas } from '../../canvas';
import { ShapeToCreateEnum } from '../../canvas-manager-interface';
import { AvailableTransformation, ComplexShapeCreator, DependeciesSetToSet, DragRangeType, ShapeToSelect } from '../complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-polygon',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/RegularPolygonIcon.svg" (click)="isTrue() && triggerModal(modalData1);" alt="Regular Polygon Creating">
 
  <ng-template #modalData1 let-modal>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Create Unfettered Regular Polygon</button>
      <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec2')">Create Dependent Regular Polygon</button>
    </div>
  </div>
  </ng-template>
     
  <ng-template #modalData2 let-modal>
  <div class="modal-header modal-title">Enter Number Of Sides</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">
       <input [(ngModel)]="sides" type="number" class="form-control" id="sides-number" placeholder="Enter Sides Number">
       <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec3')">Create Regular Polygon</button>
    </div>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class PolygonComponent {
  /** 
   * Variable used in polygon.component template.
   * @ignore */
  @ViewChild("modalData2", { static: false }) modalData2: any;

  /** 
   * Variable used in choosing operation type.
   * @ignore */
  private unfetteredShape!: boolean;

  /** 
   * Variable used in polygon.component template.
   * @ignore */
  public sides: string = "";

  /** 
   * Function used in polygon.component template.
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
   * or to ask for a number of polygon sides
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
          let n = parseInt(this.sides);
          if (n >= 3) {
            // generating vertices of polygon, first and second vertex create segment parallel to OX axis
            let vertices: [number, number][] = [];
            let radius = 4;
            let angle, cosAngle, sinAngle;
            for (let i = 0; i < n; i++) {
              angle = 2 * Math.PI * i / n - Math.PI / 2 - Math.PI / n;
              cosAngle = Math.cos(angle);
              sinAngle = Math.sin(angle);
              vertices.push([radius * cosAngle, radius * sinAngle]);
            }

            if (this.unfetteredShape) {
              ComplexShapeCreator.fullConfigurePolygon(
                vertices,
                [],
                [],
                [0, 1],
                [AvailableTransformation.TRANSLATE | AvailableTransformation.SCALE_XY | AvailableTransformation.ROTATE],
                [[0, 1]],
                [null],
                [DragRangeType.NONE],
                DependeciesSetToSet.REGULAR_POLYGON);
            }
            else {
              ComplexShapeCreator.chooseShapes("Choosing One Of Polygon Sides", [[ShapeToSelect.SEGMENT, ShapeToSelect.SEGMENT_ENDS]],
                () => {
                  let fixedPointsIds: number[] = [];
                  let point_ids = ComplexShapeCreator.getChosenShapes();
                  let fixedSidePoints: [number, number][] = [];

                  if (point_ids[0].length == 2) {
                    let ends = point_ids[0];
                    let end1 = Canvas.getShape(ends[0]);
                    let end2 = Canvas.getShape(ends[1]);
                    fixedPointsIds = [ends[0], ends[1]];
                    fixedSidePoints = [[end1.getAttr('x'), end1.getAttr('y')], [end2.getAttr('x'), end2.getAttr('y')]];
                  }
                  else {
                    fixedPointsIds = Canvas.getSegmentEnds(point_ids[0][0]);
                    let segment_points = Canvas.getShape(point_ids[0][0]).getAttr('points');
                    fixedSidePoints = [[segment_points[0], segment_points[1]], [segment_points[2], segment_points[3]]];
                  }
                  ComplexShapeCreator.fullConfigurePolygon(
                    vertices,
                    fixedPointsIds,
                    fixedSidePoints,
                    [0, 1],
                    [AvailableTransformation.MIRROR_X],
                    [Array.from(Array(n).keys())],
                    [null],
                    [DragRangeType.NONE],
                    DependeciesSetToSet.REGULAR_POLYGON);
                });
            }
          }
        }
      });
  }
}
