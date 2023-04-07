import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { UserService } from './services/user.service';
import { SchemeService } from './services/scheme.service';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PointComponent } from './dashboard/shapes-creator/buttons/point.component';
import { LineComponent } from './dashboard/shapes-creator/buttons/line.component';
import { SegmentComponent } from './dashboard/shapes-creator/buttons/segment.component';
import { CircleComponent } from './dashboard/shapes-creator/buttons/circle.component';
import { SemilineComponent } from './dashboard/shapes-creator/buttons/semiline.component';
import { PerpendicularityComponent } from './dashboard/shapes-creator/buttons/perpendicularity.component';
import { ParallelismComponent } from './dashboard/shapes-creator/buttons/parallelism.component';
import { BisectorComponent } from './dashboard/shapes-creator/buttons/bisector.component';
import { MidPerpendicularComponent } from './dashboard/shapes-creator/buttons/mid-perpendicular.component';
import { TangentCircleComponent } from './dashboard/shapes-creator/buttons/tangent-circle.component';
import { ProcessDataComponent } from './dashboard/shapes-creator/buttons/process-data.component';
import { ClearCanvasComponent } from './dashboard/shapes-creator/buttons/clear-canvas.component';
import { SetLengthComponent } from './dashboard/shapes-creator/buttons/set-length.component';
import { SetAngleValueComponent } from './dashboard/shapes-creator/buttons/set-angle-value.component';
import { EqualSegmentsComponent } from './dashboard/shapes-creator/buttons/equal-segments';
import { EqualAnglesComponent } from './dashboard/shapes-creator/buttons/equal-angles';
import { EscribedCircleComponent } from './dashboard/shapes-creator/buttons/escribed-circle.component';
import { InscribedCircleComponent } from './dashboard/shapes-creator/buttons/inscribed-circle.component';
import { CircumscribedCircleComponent } from './dashboard/shapes-creator/buttons/circumscribed-circle';
import { PolygonComponent } from './dashboard/shapes-creator/buttons/polygon.component';
import { SquareComponent } from './dashboard/shapes-creator/buttons/square.component';
import { RectangleComponent } from './dashboard/shapes-creator/buttons/rectangle.component';
import { TriangleComponent } from './dashboard/shapes-creator/buttons/triangle.component';
import { ParallelogramComponent } from './dashboard/shapes-creator/buttons/parallelogram.component';
import { KiteComponent } from './dashboard/shapes-creator/buttons/kite.component';
import { RhombusComponent } from './dashboard/shapes-creator/buttons/rhombus.component';
import { TrapezoidComponent } from './dashboard/shapes-creator/buttons/trapezoid.component';
import { DivideSegmentComponent } from './dashboard/shapes-creator/buttons/divide-segment.component';
import { DivideAngleComponent } from './dashboard/shapes-creator/buttons/divide-angle.component';
import { AltitudeComponent } from './dashboard/shapes-creator/buttons/altitude.component';
import { MedianComponent } from './dashboard/shapes-creator/buttons/median.component';
import { MidSegmentComponent } from './dashboard/shapes-creator/buttons/mid-segment.component';
import { DependenciesPresenterComponent } from './dashboard/dependencies-presenter/dependencies-presenter.component';
import { ComplexShapeCreatorComponent } from './dashboard/shapes-creator/complex-shape-creator/complex-shape-creator.component';
import { ShapesCreatorComponent } from './dashboard/shapes-creator/shapes-creator.component';
import { SaveSchemeComponent } from './dashboard/shapes-creator/buttons/save-scheme.component';
import { LoadSchemeComponent } from './dashboard/shapes-creator/buttons/load-scheme.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PointComponent,
    LineComponent,
    SegmentComponent,
    CircleComponent,
    SemilineComponent,
    PerpendicularityComponent,
    ParallelismComponent,
    BisectorComponent,
    MidPerpendicularComponent,
    TangentCircleComponent,
    ProcessDataComponent,
    ClearCanvasComponent,
    SetLengthComponent,
    SetAngleValueComponent,
    EqualSegmentsComponent,
    EqualAnglesComponent,
    EscribedCircleComponent,
    InscribedCircleComponent,
    CircumscribedCircleComponent,
    PolygonComponent,
    SquareComponent,
    RectangleComponent,
    TriangleComponent,
    ParallelogramComponent,
    KiteComponent,
    RhombusComponent,
    TrapezoidComponent,
    DivideSegmentComponent,
    DivideAngleComponent,
    AltitudeComponent,
    MedianComponent,
    MidSegmentComponent,
    DependenciesPresenterComponent,
    ComplexShapeCreatorComponent,
    ShapesCreatorComponent,
    SaveSchemeComponent,
    LoadSchemeComponent,
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
    }), 
    NgbModule, BrowserAnimationsModule, ToastrModule.forRoot()
  ],
  providers: [UserService, SchemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }

