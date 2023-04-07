/**
 * Module contains implementation of LoadSchemeComponent. This button is used to load saved scheme.
 * 
 * @module Load Scheme Component
 */

import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SchemeService } from 'src/app/services/scheme.service';
import { Canvas } from '../../canvas';
import { CanvasManagerInterface, ShapeToCreateEnum } from '../../canvas-manager-interface';

@Component({
  selector: 'app-load-scheme',
  template: `
  <input type="image" class="icon-button" src="/static/imgs/LoadIcon.svg" (click)="isTrue() && onClick();" alt="Load Scheme">

  <ng-template #modalData let-modal>
  <div class="modal-header modal-title">Loading Saved Scheme</div>
  <div class="modal-body" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <div class="row" style="display: flex; justify-content: center;">

      <div class="col">
        <p> Scheme Name </p>
        <div *ngFor="let item of titles">
          <label class="form-check-label">
              <input class="form-check-input" type="checkbox" (change)="titlesOnChange($event.target, item)" [checked]="isTitleChecked(item)"> 
              {{item}}
          </label>
        </div>
      </div>

      <div class="col">
        <p> Scheme Author </p>
        <div *ngFor="let item of authors">
          <label class="form-check-label">
              <input class="form-check-input" type="checkbox" (change)="authorsOnChange($event.target, item)" [checked]="isAuthorChecked(item)"> 
              {{item}}
          </label>
        </div>
      </div>

      <div class="col">
        <p> Matching Schemes </p>
        <div *ngFor="let item of chosenSchemes">
          <label class="form-check-label">
            <input type="radio" class="form-check-input" name="optradio" (change)="setScheme(item)">
            {{ item['title'] }} - {{ item['user'] }} - {{ item['date'].substring(0,10) }}
          </label>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-footer" style="display: flex; justify-content: center; background-color: #EBEBEB;">
    <button type="button" class="btn modal-btn" (click)="modal.dismiss('dec1')">Load Scheme</button>
  </div>
  </ng-template>
  `,
  styleUrls: ['./../../dashboard.component.css']
})
export class LoadSchemeComponent {
  schemes: any[] = [];
  chosenSchemes: any[] = [];
  chosenScheme: any = null;
  titles: string[] = [];
  chosenTitles: string[] = [];
  authors: string[] = [];
  chosenAuthors: string[] = [];

  /** 
   * Variable used in set-length.component template.
   * @ignore */
  @ViewChild("modalData", { static: false }) content: any;

  /** 
   * Function used in save-scheme.component template.
   * Check if it is currently not possible drawing some shape.
   * @ignore */
  public isTrue() {
    return Canvas.getCurrentyCreatedShape() == ShapeToCreateEnum.NONE;
  }

  constructor(private modalService: NgbModal, private toastrService: ToastrService, private schemeService: SchemeService) { }

  ngOnInit(): void { }

  setChosenSchemes() {
    this.chosenSchemes = [];
    this.schemes.forEach(item => {
      if (this.chosenAuthors.includes(item['user']) && this.chosenTitles.includes(item['title'])) {
        this.chosenSchemes.push(item);
      }
    });
  }

  isTitleChecked(item: string) {
    if (this.chosenTitles.includes(item)) { return true; }
    else { return false; }
  }

  titlesOnChange(target: EventTarget | null, item: string) {
    if ((target as any).checked) { this.chosenTitles.push(item); }
    else { this.chosenTitles.splice(this.chosenTitles.indexOf(item), 1); }
    this.setChosenSchemes();
  }

  isAuthorChecked(item: string) {
    if (this.chosenAuthors.includes(item)) { return true; }
    else { return false; }
  }

  authorsOnChange(target: EventTarget | null, item: string) {
    if ((target as any).checked) { this.chosenAuthors.push(item); }
    else { this.chosenAuthors.splice(this.chosenAuthors.indexOf(item), 1); }
    this.setChosenSchemes();
  }

  setScheme(scheme: any) {
    this.chosenScheme = scheme;
  }

  /**
   * Function called after clicked on this component(button).
   */
  onClick(): void {
    this.schemeService.list().subscribe(
      data => {
        this.toastrService.success("Successfully pulled the data!", "", { timeOut: 3000, progressBar: false });

        this.schemes = (data as any[]);
        this.schemes.forEach(element => {
          let t = element['title'];
          if (!(this.titles.includes(t))) { this.titles.push(t); }

          let a = element['user'];
          if (!(this.authors.includes(a))) { this.authors.push(a); }
        });

        this.titles.sort();
        this.authors.sort();

        this.triggerModal(this.content);
      },
      error => {
        this.toastrService.success("Failed to pull the data", "", { timeOut: 3000, progressBar: false });
      }
    )
  }

  triggerModal(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (res) => { }, (res) => {
        if (res == "dec1") {
          if (this.chosenScheme == null) { return; }

          const body = JSON.parse(this.chosenScheme['body']);
          const points = body['points'];
          const segments = body['segments'];
          const circles = body['circles'];
          const lines = body['lines'];

          const lengths = body['lengths'];
          const angleValues = body['angleValues'];
          const perpendicular = body['perpendicular'];
          const parallel = body['parallel'];
          const equalSegments = body['equalSegments'];
          const equalAngles = body['equalAngles'];
          const bisectorLines = body['bisectorLines'];
          const escribedCircles = body['escribedCircles'];
          const inscribedCircles = body['inscribedCircles'];
          const circumscribedCircles = body['circumscribedCircles'];
          const tangentCircles = body['tangentCircles'];
          const tangentLines = body['tangentLines'];
          const polygonTypes = body['polygonTypes'];
          const altitudes = body['altitudes'];
          const medians = body['medians'];
          const midPerpendicularLines = body['midPerpendicularLines'];
          const midSegments = body['midSegments'];

          let idsConverter: Record<number, number> = {};
          let lineIdsConverter: Record<number, number> = {};

          Canvas.reinit();
          Canvas.waitForCalculationsProcessed();

          if (points != null) {
            CanvasManagerInterface.setCurrentlyCreatedShape(ShapeToCreateEnum.POINT);

            points.forEach((point: { x: number, y: number, id: number }) => {
              CanvasManagerInterface.clickedOnCanvas(point['x'], point['y']);
              idsConverter[point['id']] = Canvas.getLastCreatedPointId();
              Canvas.waitForCalculationsProcessed();
            });

            CanvasManagerInterface.setCurrentlyCreatedShape(ShapeToCreateEnum.NONE);
          }

          if (segments != null) {
            CanvasManagerInterface.setCurrentlyCreatedShape(ShapeToCreateEnum.SEGMENT);

            segments.forEach((segment: { end1Id: number, end2Id: number, id: number }) => {
              CanvasManagerInterface.clickedOnPoint(idsConverter[segment['end1Id']]);
              Canvas.waitForCalculationsProcessed();
              CanvasManagerInterface.clickedOnPoint(idsConverter[segment['end2Id']]);
              Canvas.waitForCalculationsProcessed();
              idsConverter[segment['id']] = Canvas.getLastCreatedSegmentId();
            });

            CanvasManagerInterface.setCurrentlyCreatedShape(ShapeToCreateEnum.NONE);
          }

          if (circles != null) {
            CanvasManagerInterface.setCurrentlyCreatedShape(ShapeToCreateEnum.CIRCLE);

            circles.forEach((circle: { centerId: number, pointsOn: number[], id: number }) => {
              CanvasManagerInterface.clickedOnPoint(idsConverter[circle['centerId']]);
              Canvas.waitForCalculationsProcessed();
              CanvasManagerInterface.clickedOnPoint(idsConverter[circle['pointsOn'][0]]);
              Canvas.waitForCalculationsProcessed();
              idsConverter[circle['id']] = Canvas.getLastCreatedCircleId();
            });

            CanvasManagerInterface.setCurrentlyCreatedShape(ShapeToCreateEnum.NONE);
          }

          const currentSchemeJson: any = CanvasManagerInterface.getJsonData();
          const newLines: { id: number, string: string }[] = currentSchemeJson['lines'];

          if (lines != null) {
            lines.forEach((line: { id: number, string: string }) => {
              lineIdsConverter[line['id']] = newLines.filter(item => { return item['string'] == line['string'] })[0]['id'];
            });
          }

          if (lengths != null) {
            lengths.forEach((length: { end1Id: number, end2Id: number, value: string }) => {
              CanvasManagerInterface.setLengthValue(idsConverter[length['end1Id']], idsConverter[length['end2Id']], length['value']);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (angleValues != null) {
            angleValues.forEach((angleValue: { end1Id: number, vertexId: number, end2Id: number, type: number, value: string }) => {
              CanvasManagerInterface.setAngleValue(idsConverter[angleValue['end1Id']], idsConverter[angleValue['vertexId']], idsConverter[angleValue['end2Id']], angleValue['type'], angleValue['value']);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (perpendicular != null) {
            perpendicular.forEach((dependency: { id1: number, id2: number }) => {
              CanvasManagerInterface.setPerpendicularLines(lineIdsConverter[dependency['id1']], lineIdsConverter[dependency['id2']]);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (parallel != null) {
            parallel.forEach((dependency: { id1: number, id2: number }) => {
              CanvasManagerInterface.setParallelLines(lineIdsConverter[dependency['id1']], lineIdsConverter[dependency['id2']]);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (equalSegments != null) {
            equalSegments.forEach((dependency: { s1End1Id: number, s1End2Id: number, s2End1Id: number, s2End2Id: number }) => {
              CanvasManagerInterface.setEqualSegmentsDependencyWithEnds(idsConverter[dependency['s1End1Id']], idsConverter[dependency['s1End2Id']], idsConverter[dependency['s2End1Id']], idsConverter[dependency['s2End2Id']]);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (equalAngles != null) {
            equalAngles.forEach((dependency: { a1End1Id: number, a1End2Id: number, a1VertexId: number, a1Type: number, a2End1Id: number, a2End2Id: number, a2VertexId: number, a2Type: number }) => {
              CanvasManagerInterface.setEqualAnglesDependency(idsConverter[dependency['a1End1Id']], idsConverter[dependency['a1VertexId']], idsConverter[dependency['a1End2Id']], idsConverter[dependency['a2End1Id']], idsConverter[dependency['a2VertexId']], idsConverter[dependency['a2End2Id']]);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (midPerpendicularLines != null) {
            midPerpendicularLines.forEach((dependency: { end1Id: number, end2Id: number, lineId: number }) => {
              CanvasManagerInterface.createSegmentMidPerpendicularWithEnds(idsConverter[dependency['end1Id']], idsConverter[dependency['end2Id']]);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (bisectorLines != null) {
            bisectorLines.forEach((dependency: { point1Id: number, vertexId: number, point2Id: number, angleType: number, lineId: number }) => {
              CanvasManagerInterface.createBisectorLine(idsConverter[dependency['point1Id']], idsConverter[dependency['vertexId']], idsConverter[dependency['point2Id']], dependency['angleType'] == 1)
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (escribedCircles != null) {
            escribedCircles.forEach((dependency: { circleId: number, polygon: number[] }) => {
              CanvasManagerInterface.setEscribedCircle(idsConverter[dependency['circleId']], dependency['polygon'].map(id => idsConverter[id]));
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (inscribedCircles != null) {
            inscribedCircles.forEach((dependency: { circleId: number, polygon: number[] }) => {
              CanvasManagerInterface.setInscribedCircle(idsConverter[dependency['circleId']], dependency['polygon'].map(id => idsConverter[id]));
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (circumscribedCircles != null) {
            circumscribedCircles.forEach((dependency: { circleId: number, polygon: number[] }) => {
              CanvasManagerInterface.setCircumscribedCircle(idsConverter[dependency['circleId']], dependency['polygon'].map(id => idsConverter[id]));
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (tangentCircles != null) {
            tangentCircles.forEach((dependency: { id1: number, id2: number }) => {
              CanvasManagerInterface.setTangentCircles(idsConverter[dependency['id1']], idsConverter[dependency['id2']]);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (tangentLines != null) {
            tangentLines.forEach((dependency: { circleId: number, lineId: number }) => {
              CanvasManagerInterface.setTangentLineToCircle(lineIdsConverter[dependency['lineId']], idsConverter[dependency['circleId']]);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (polygonTypes != null) {
            polygonTypes.forEach((dependency: { polygon: number[], type: number }) => {
              CanvasManagerInterface.setPolygonType(dependency['polygon'].map(id => idsConverter[id]), dependency['type']);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (altitudes != null) {
            altitudes.forEach((dependency: { end1Id: number, end2Id: number, lineId: number }) => {
              CanvasManagerInterface.setAltitude(idsConverter[dependency['end1Id']], idsConverter[dependency['end2Id']], lineIdsConverter[dependency['lineId']]);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (medians != null) {
            medians.forEach((dependency: { s1End1Id: number, s1End2Id: number, s2End1Id: number, s2End2Id: number }) => {
              CanvasManagerInterface.setMedian(idsConverter[dependency['s1End1Id']], idsConverter[dependency['s1End2Id']], idsConverter[dependency['s2End1Id']], idsConverter[dependency['s2End2Id']]);
              Canvas.waitForCalculationsProcessed();
            });
          }

          if (midSegments != null) {
            midSegments.forEach((dependency: { a1End1Id: number, a1End2Id: number, a2End1Id: number, a2End2Id: number, sEnd1: number, sEnd2: number }) => {
              CanvasManagerInterface.setMidSegment(idsConverter[dependency['a1End1Id']], idsConverter[dependency['a1End2Id']], idsConverter[dependency['a2End1Id']], idsConverter[dependency['a2End2Id']], idsConverter[dependency['sEnd1']], idsConverter[dependency['sEnd2']]);
              Canvas.waitForCalculationsProcessed();
            });
          }
        }
      });
  }
}

