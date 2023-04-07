import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComplexShapeCreator } from './complex-shape-creator/complex-shapes-creator';

@Component({
  selector: 'app-shapes-creator',
  templateUrl: './shapes-creator.component.html',
  styleUrls: ['./../dashboard.component.css']
})
export class ShapesCreatorComponent implements OnInit {
  public static displayShapesCreator$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  displayComplexShapeCreator = false;

  constructor() {
    ComplexShapeCreator.displayComplexShapeCreator$.subscribe(value => {
      this.displayComplexShapeCreator = value;
    });
  }

  ngOnInit(): void { }

}
