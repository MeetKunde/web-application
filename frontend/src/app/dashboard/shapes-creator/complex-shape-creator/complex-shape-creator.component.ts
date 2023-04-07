import { Component, OnInit } from '@angular/core';
import { AvailableTransformation, ComplexShapeCreator } from './complex-shapes-creator';

@Component({
  selector: 'app-complex-shape-creator',
  templateUrl: './complex-shape-creator.component.html',
  styleUrls: ['./../../dashboard.component.css']
})
export class ComplexShapeCreatorComponent implements OnInit {
  displayInstructions = false;
  displayPolygonMovement = false;

  availableTransformationType = AvailableTransformation.NONE;

  title = ""
  instructions = ""
  displayMovingPointAlert = false;
  movingPointAlert = ""

  constructor() {
    ComplexShapeCreator.displayInstructions$.subscribe(value => {
      this.displayInstructions = value;
    });

    ComplexShapeCreator.displayPolygonMovement$.subscribe(value => {
      this.displayPolygonMovement = value;
    });

    ComplexShapeCreator.titleToSet$.subscribe(value => {
      this.title = value;
    });

    ComplexShapeCreator.instructionToSet$.subscribe(value => {
      this.instructions = value;
    });

    ComplexShapeCreator.displayMovingPointAlert$.subscribe(value => {
      this.displayMovingPointAlert = value;
    });

    ComplexShapeCreator.movingPointAlert$.subscribe(value => {
      this.movingPointAlert = value;
    });

    ComplexShapeCreator.availableTransformationType$.subscribe(value => {
      this.availableTransformationType = value;
    });

  }

  ngOnInit(): void { }

  /**
  * Checking if specific transformation is now available to use.
  * @param transformation specific transformation to check
  * @returns true if transformation can be use, false otherwise
  * @ignore */
  public checkAvailableTransformation(transformation: AvailableTransformation): boolean {
    return (transformation & this.availableTransformationType) != 0;
  }

  public cancelChoosing(): void {
    ComplexShapeCreator.cancelChoosing();
  }

  public arrowUp() {
    ComplexShapeCreator.translatePoints(0, 1, true);
  }

  public arrowDown() {
    ComplexShapeCreator.translatePoints(0, -1, true);
  }

  public arrowLeft() {
    ComplexShapeCreator.translatePoints(1, 0, true);
  }

  public arrowRight() {
    ComplexShapeCreator.translatePoints(-1, 0, true);
  }

  public rescaleXPlus() {
    ComplexShapeCreator.scalePoints(1.05, 1);
    ComplexShapeCreator.calculateTransformations();
  }

  public rescaleYPlus() {
    ComplexShapeCreator.scalePoints(1, 1.05);
    ComplexShapeCreator.calculateTransformations();
  }


  public rescaleXYPlus() {
    ComplexShapeCreator.scalePoints(1.05, 1.05);
    ComplexShapeCreator.calculateTransformations();
  }

  public rescaleXMinus() {
    ComplexShapeCreator.scalePoints(0.95, 1);
    ComplexShapeCreator.calculateTransformations();
  }

  public rescaleYMinus() {
    ComplexShapeCreator.scalePoints(1, 0.95);
    ComplexShapeCreator.calculateTransformations();
  }

  public rescaleXYMinus() {
    ComplexShapeCreator.scalePoints(0.95, 0.95);
    ComplexShapeCreator.calculateTransformations();
  }

  public rotateClockwise() {
    ComplexShapeCreator.rotatePoints(15, true, false);
  }

  public rotateCounterClockwise() {
    ComplexShapeCreator.rotatePoints(15, false, false);
  }

  public cancelConfiguring(): void {
    ComplexShapeCreator.cancelConfiguring();
  }

  public confirmPolygonCreating(): void {
    ComplexShapeCreator.confirmPolygonCreating();
  }

  public changeSide(): void {
    ComplexShapeCreator.changeSide();
  }

  public mirrorImageX(): void {
    ComplexShapeCreator.mirrorImageX();
  }

  public mirrorImageY(): void {
    ComplexShapeCreator.mirrorImageY();
  }

  public reverse(): void {
    ComplexShapeCreator.reverse();
  }
}
