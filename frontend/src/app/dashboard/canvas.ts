/**
 * Module contains a static class Canvas for representating Konva.Stage - HTML Canvas - with some extentions,
 * managing functions, events and an enum ShapesEnum for selecting type of shapes to create.
 * 
 * @module Canvas
 */

import Konva from "konva";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { Appearance } from "./appearance";
import { CanvasManagerInterface, ShapeToCreateEnum } from "./canvas-manager-interface";
import { DependenciesPresenter } from "./dependencies-presenter/dependencies-presenter";
import { ComplexShapeCreator } from "./shapes-creator/complex-shape-creator/complex-shapes-creator";
import { ShapesCreatorComponent } from "./shapes-creator/shapes-creator.component";

/**
 * Enum holds special types of complex shapes.
 */
export enum ComplexShapeEnum {
    NONE,
    PERPENDICULAR_LINE,
    PARALLEL_LINE,
}

/**
 * Static class for representation of Konva.Stage - HTML5 Canvas. It extends Konva library objects by functions to easy draw basic geometry shapes,
 * to resolve clicks on created shapes, to prompt during creating new shapes and to make created shapes interactive. 
 * Class contains many constant variables with shapes properties which are used in creating all shapes.
 */
export class Canvas {
    private static screenWidth: number;
    private static screenHeight: number;

    /** Width of created HTML5 Canvas. */
    private static width: number;

    /** Height of created HTML5 Canvas. */
    private static height: number;

    /** Container ID where were created HTML5 Canvas. */
    private static containerID: string;

    /** Counter of created points. */
    private static pointIdCounter: number;

    /** Counter of created shapes. */
    private static shapeIdCounter: number;

    /** HTML Canvas object. */
    private static stage: Konva.Stage;

    /** Layer for points, segments, lines, semilines, circles drawing and textes */
    private static shapesLayer: Konva.Layer;

    /** Layer for segments, lines, semilines, circles prompting. */
    private static batchLayer: Konva.Layer;

    /** Layer for guide lines drawing. */
    private static guideLayer: Konva.Layer;

    private static highlightLayer: Konva.Layer;

    /** Type of currently created shape. */
    private static currentlyCreatedShape: ShapeToCreateEnum;

    /** Complex shape currently created. */
    private static currentlyComplexShape: ComplexShapeEnum;

    /** First variable indicating whether to draw a prompting shape. */
    private static drawPromptingShapes: boolean;

    /** Second variable indicating whether to draw a prompting shape. 
     * If it is not null then array elements are X and Y coordinates of first point of prompting shape. */
    private static promptingShapeStartPoint: [number, number] | null;

    /** Variable with properties of base on which prompting line is creating.
     * x = b: [null, b]
     * y = b: [0, b]
     * y = ax + b: [a, b] */
    private static baseToPromptingLine: [number | null, number] | null;

    /** Array of IDs of currently activated shapes. */
    private static activatedShapes: string[];

    /** Array with point names. n-th element is name of point with id=n */
    public static pointNames: string[];

    /** Object of moving prompting point. */
    private static movingPromptingPoint: any;

    /** Array with X coordinates using in finding vertical guide line. */
    private static guideLineX: number[];

    /** Array with Y coordinates using in finding horizontal guide line. */
    private static guideLineY: number[];

    /** Currently vertical guide line. */
    private static currentGuideLineX: number | null;

    /** Currently horizontal guide line. */
    private static currentGuideLineY: number | null;

    /** Variable indicating whether to draw guide lines. */
    private static drawGuideLines: boolean;

    private static toastrService: ToastrService;

    public static blockInterface$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    private static lastCreatedPointId: number;
    private static lastCreatedSegmentId: number;
    private static lastCreatedCircleId: number;

    private static POINT_Z_INDEX: number = 3;
    private static LINE_Z_INDEX: number = 2;
    private static CIRCLE_Z_INDEX: number = 1;
    private static TEXT_Z_INDEX: number = 4;

    private static DIMENSION_MULTIPIER = 3;
    private static SCALING_INCREASE = 0.01;
    private static currentScale: number;
    private static maximalScale: number;
    private static minimalScale: number;

    /** Empty function: static class has no constructor. */
    constructor() { }

    /**
     * Canvas initialization to drawing. This has to be called before using this class.
     * @param width width of the creating canvas 
     * @param height height of the creating canvas 
     * @param container ID of the container in DOM where canva is to appear
     */
    public static init(screenWidth: number, screenHeight: number, container: string, toastr: ToastrService): void {
        Canvas.screenWidth = screenWidth;
        Canvas.screenHeight = screenHeight;
        Canvas.width = screenWidth * Canvas.DIMENSION_MULTIPIER;
        Canvas.height = screenHeight * Canvas.DIMENSION_MULTIPIER;
        Canvas.containerID = container;
        Canvas.toastrService = toastr;

        Canvas.currentlyCreatedShape = ShapeToCreateEnum.NONE;
        Canvas.currentlyComplexShape = ComplexShapeEnum.NONE
        Canvas.pointIdCounter = 0;
        Canvas.shapeIdCounter = 1;
        Canvas.drawPromptingShapes = true;
        Canvas.promptingShapeStartPoint = null;
        Canvas.baseToPromptingLine = null;
        Canvas.activatedShapes = [];
        Canvas.pointNames = [];

        Canvas.guideLineX = [];
        Canvas.guideLineY = [];
        Canvas.currentGuideLineX = null;
        Canvas.currentGuideLineY = null;
        Canvas.drawGuideLines = true;

        Canvas.blockInterface$.next(true);

        Canvas.lastCreatedPointId = 0;
        Canvas.lastCreatedSegmentId = 0;
        Canvas.lastCreatedCircleId = 0;

        ShapesCreatorComponent.displayShapesCreator$.next(true);
        ComplexShapeCreator.displayComplexShapeCreator$.next(false);
        DependenciesPresenter.displayDependenciesPresenter$.next(false);

        Canvas.currentScale = 1.0;
        Canvas.maximalScale = 2;
        Canvas.minimalScale = 1 / Canvas.DIMENSION_MULTIPIER;

        // stage creating
        Canvas.stage = new Konva.Stage({
            container: container,
            x: -((Canvas.DIMENSION_MULTIPIER - 1) / 2) * screenWidth,
            y: -((Canvas.DIMENSION_MULTIPIER - 1) / 2) * screenHeight,
            width: screenWidth,
            height: screenWidth,
            draggable: true,
            centeredScaling: true,
            scale: { x: Canvas.currentScale, y: Canvas.currentScale }
        });

        // layers creating
        Canvas.shapesLayer = new Konva.Layer();
        Canvas.batchLayer = new Konva.Layer();
        Canvas.guideLayer = new Konva.Layer();
        Canvas.highlightLayer = new Konva.Layer();

        // adding layers to stage
        Canvas.stage.add(Canvas.shapesLayer);
        Canvas.stage.add(Canvas.batchLayer);
        Canvas.stage.add(Canvas.guideLayer);
        Canvas.stage.add(Canvas.highlightLayer);

        // setting layers indexes - layer positions during drawing
        Canvas.highlightLayer.zIndex(0);
        Canvas.guideLayer.zIndex(0);
        Canvas.batchLayer.zIndex(1);
        Canvas.shapesLayer.zIndex(2);

        // start drawing layers
        Canvas.shapesLayer.draw();
        Canvas.batchLayer.batchDraw();
        Canvas.guideLayer.draw();
        Canvas.highlightLayer.draw();

        // bind function for dragmoves for canvas
        Canvas.stage.on('dragmove', () => {
            let boundX = Canvas.screenWidth - Canvas.width * Canvas.currentScale;
            let boundY = Canvas.screenHeight - Canvas.height * Canvas.currentScale;

            if (Canvas.stage.x() > 0) {
                Canvas.stage.x(0);
            }
            else if (Canvas.stage.x() < boundX) {
                Canvas.stage.x(boundX);
            }

            if (Canvas.stage.y() > 0) {
                Canvas.stage.y(0);
            }
            else if (Canvas.stage.y() < boundY) {
                Canvas.stage.y(boundY);
            }
        });

        // bind function for clicks on canvas
        Canvas.stage.on("click", () => {
            if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.NONE) {
                return;
            }

            let clickPosition = Canvas.shapesLayer.getRelativePointerPosition();
            let clickX: number;
            let clickY: number;

            if (Canvas.currentGuideLineX) { clickX = Canvas.currentGuideLineX; }
            else { clickX = clickPosition.x; }

            if (Canvas.currentGuideLineY) { clickY = Canvas.currentGuideLineY; }
            else { clickY = clickPosition.y; }

            if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.COMPLEX_SHAPE) {
                ComplexShapeCreator.clickedOnCanvas(clickX, clickY, Canvas.shapeIdCounter);
            }
            else {
                CanvasManagerInterface.clickedOnCanvas(clickX, clickY);
            }
        });

        // bind function for mouse move on canvas
        Canvas.stage.on("mousemove", () => {
            let click = Canvas.batchLayer.getRelativePointerPosition();

            Canvas.findGuideLines(click.x, click.y);

            if (Canvas.drawPromptingShapes) {
                if (Canvas.promptingShapeStartPoint !== null || Canvas.currentlyComplexShape == ComplexShapeEnum.PERPENDICULAR_LINE || Canvas.currentlyComplexShape == ComplexShapeEnum.PARALLEL_LINE) {
                    Canvas.drawPromptingShape(click.x, click.y);
                }
            }
        });

        Canvas.stage.on('wheel', (e) => {
            e.evt.preventDefault();

            let direction = e.evt.deltaY > 0 ? 1 : -1;
            if (e.evt.ctrlKey) {
                direction = -direction;
            }

            let oldScale = Canvas.stage.scaleX();
            let newScale = Canvas.currentScale + Canvas.SCALING_INCREASE * direction;

            if (newScale < Canvas.minimalScale) {
                newScale = Canvas.minimalScale;
            }
            else if (newScale > Canvas.maximalScale) {
                newScale = Canvas.maximalScale;
            }

            Canvas.stage.scale({ x: newScale, y: newScale });
            Canvas.currentScale = newScale;

            let newPos = {
                x: Canvas.stage.x() + (oldScale - newScale) * Canvas.width * 0.5,
                y: Canvas.stage.y() + (oldScale - newScale) * Canvas.height * 0.5
            }

            let boundX = Canvas.screenWidth - Canvas.width * newScale;
            let boundY = Canvas.screenHeight - Canvas.height * newScale;

            if (newPos.x > 0) {
                newPos.x = 0;
            }
            else if (newPos.x < boundX) {
                newPos.x = boundX;
            }

            if (newPos.y > 0) {
                newPos.y = 0;
            }
            else if (newPos.y < boundY) {
                newPos.y = boundY;
            }

            Canvas.stage.position(newPos);
        });

        // clearing guiding lines when mouse leave the canvas
        let canvaObject = document.getElementById(Canvas.containerID);
        canvaObject!.addEventListener("mouseleave", function (event) {
            Canvas.guideLayer.destroyChildren();
            if(!ComplexShapeCreator.displayPolygonMovement$.value) {
                Canvas.batchLayer.destroyChildren();
            }
        }, false);

        // initializing new canvas
        CanvasManagerInterface.init(screenWidth * Canvas.DIMENSION_MULTIPIER, screenHeight * Canvas.DIMENSION_MULTIPIER, 7,
            this.drawPoint, this.drawLine, this.drawCircle, this.deleteShape, this.setPromptingShapeStartPoint, this.lockUI, this.unlockUI, this.resolveAlert);

        let greenLine = new Konva.Line({
            points: [0, 0,
                Canvas.DIMENSION_MULTIPIER * screenWidth, 0,
                Canvas.DIMENSION_MULTIPIER * screenWidth, Canvas.DIMENSION_MULTIPIER * screenHeight,
                0, Canvas.DIMENSION_MULTIPIER * screenHeight],
            stroke: '#EBEBEB',
            strokeWidth: 2,
            lineJoin: 'round',
            closed: true
        });

        Canvas.shapesLayer.add(greenLine);
        greenLine.zIndex(Canvas.POINT_Z_INDEX);
    }

    private static lockTime = 0;

    public static lockUI(): void {
        Canvas.blockInterface$.next(true);
        Canvas.lockTime = new Date().getTime();

        //document.getElementById('block-ui')!.style.display = 'block';

        console.log("LOCKED...");
    }

    public static unlockUI(): void {
        Canvas.blockInterface$.next(false);

        console.log("UNLOCKED..." + (new Date().getTime() - Canvas.lockTime));
    }

    public static getLastCreatedPointId(): number {
        return Canvas.lastCreatedPointId;
    }

    public static getLastCreatedSegmentId(): number {
        return Canvas.lastCreatedSegmentId;
    }

    public static getLastCreatedCircleId(): number {
        return Canvas.lastCreatedCircleId;
    }

    public static waitForCalculationsProcessed() {
        (function loopSearch() {
            if (Canvas.blockInterface$.value) {
                setTimeout(function () {
                    loopSearch();
                }, 10);
            }
            else {
                return;
            }
        })();
    }

    public static async resolveAlert(alertType: number, content: string) {
        switch (alertType) {
            case 1:
                Canvas.toastrService.success(content, "", { timeOut: 3000, progressBar: false });
                break;
            case 2:
                Canvas.toastrService.error(content, "", { timeOut: 3000, progressBar: false });
                break;
            case 3:
                Canvas.toastrService.info(content, "", { timeOut: 3000, progressBar: false });
                break;
            case 4:
                Canvas.reinit();
                alert(content);
                break;
            default:
                break;
        }
    }

    /**
     * Reinitialization of canva. All data are lost.
     */
    public static reinit(): void {
        Canvas.init(Canvas.screenWidth, Canvas.screenHeight, Canvas.containerID, Canvas.toastrService);
        CanvasManagerInterface.clearCanvas();
    }

    /**
     * Getting width of canvas.
     * @returns width of canvas
     */
    public static getWidth(): number {
        return Canvas.width;
    }

    public static getScreenWidth(): number {
        return Canvas.screenWidth;
    }

    /**
     * Getting height of canvas.
     * @returns height of canvas
     */
    public static getHeight(): number {
        return Canvas.height;
    }

    public static getScreenHeight(): number {
        return Canvas.screenHeight;
    }

    /**
     * Setting type of currently created shape.
     * @param shape - shape type to set
     */
    public static setCurrentyCreatedShape(shape: ShapeToCreateEnum): void {
        Canvas.currentlyCreatedShape = shape;
        CanvasManagerInterface.setCurrentlyCreatedShape(shape);
    }

    /**
     * Getting type of currently created shape.
     * @returns type of currently created shape
     */
    public static getCurrentyCreatedShape(): ShapeToCreateEnum {
        return Canvas.currentlyCreatedShape;
    }

    /**
     * Setting type of currently created complex shape.
     * @param shape - shape type to set
     */
    public static setCurrentlyComplexShape(shape: ComplexShapeEnum): void {
        Canvas.currentlyComplexShape = shape;
    }

    /**
     * Getting type of currently created complex shape.
     * @returns type of currently created complex shape
     */
    public static getCurrentlyComplexShape(): ComplexShapeEnum {
        return Canvas.currentlyComplexShape;
    }

    /**
     * Getting currently shape ID counter.
     * @returns currently shape ID counter
     */
    public static getShapeIdCounter(): number {
        return Canvas.shapeIdCounter;
    }

    /**
     * Getting currently point ID counter.
     * @returns currently point ID counter
     */
    public static getPointIdCounter(): number {
        return Canvas.pointIdCounter;
    }

    /**
     * Setting start point of prompting shape.
     * @param x X coordinate of start point of prompting shape
     * @param y Y coordinate of start point of prompting shape
     */
    public static setPromptingShapeStartPoint(set: boolean, x: number, y: number): void {
        if (set) {
            Canvas.promptingShapeStartPoint = [x, y];
        }
        else {
            Canvas.promptingShapeStartPoint = null;
            Canvas.batchLayer.destroyChildren();
        }
    }

    /**
     * Reset of prompting shape start point. It set value of Canvas.promptingShapeStartPoint to null.
     */
    public static resetPromptingStartPoint(): void {
        Canvas.promptingShapeStartPoint = null;
        Canvas.batchLayer.destroyChildren();
    }

    /**
     * Setting base of prompting line.
     * @param equation array with cooeficients of line equation
     */
    public static setBaseToPromptingLine(equation: [number | null, number] | null): void {
        Canvas.baseToPromptingLine = equation;
    }

    /**
     * Getting shape by ID
     * @param id ID of shape to get
     * @returns shape with given ID
     */
    public static getShape(id: number): any {
        return Canvas.stage.find('#id' + id)[0];
    }

    /**
     * Deletion of shape.
     * @param id ID of shape to delete
     */
    public static deleteShape(id: number): void {
        Canvas.shapesLayer.find('#id' + id)[0].destroy();
    }

    /**
     * Clearing batch layer.
     */
    public static clearBatchLayer(): void {
        Canvas.batchLayer.destroyChildren();
        Canvas.promptingShapeStartPoint = null;
    }

    public static getSegmentEnds(id: number): [number, number] {
        let segment = Canvas.getShape(id);
        let endCoords = segment.getAttr('points');
        let end1 = [endCoords[0], endCoords[1]];
        let end2 = [endCoords[2], endCoords[3]];

        let result: [number, number] = [0, 0];

        for (let i = 1; i < Canvas.shapeIdCounter; i++) {
            try {
                let shape = Canvas.getShape(i);
                if (Math.abs(shape.getAttr('x') - end1[0]) < 1 && Math.abs(shape.getAttr('y') - end1[1]) < 1) {
                    result[0] = i;
                }
                else if (Math.abs(shape.getAttr('x') - end2[0]) < 1 && Math.abs(shape.getAttr('y') - end2[1]) < 1) {
                    result[1] = i;
                }
            } catch (error) {

            }
        }

        return result;
    }

    /**
     * Drawing point on canvas.
     * @param x_coordinate X coordinate of creating point
     * @param y_coordinate Y coordinate of creating point
     * @param id shape ID to set
     */
    public static drawPoint(id: number, x_coordinate: number, y_coordinate: number): void {
        let shape = new Konva.Circle({
            id: "id" + id,
            x: x_coordinate,
            y: y_coordinate,
            fill: Appearance.basicShapesColor,
            radius: Appearance.pointRadius,
            hitStrokeWidth: Appearance.pointHitStrokeWidth,
        })

        // bind function for mouse over a point
        shape.on("mouseover", function () {
            Canvas.drawGuideLines = false;

            shape.radius(Appearance.mouseoverPointRadius);
            shape.fill(Appearance.mouseoverShapesColor);

            Canvas.drawPromptingShapes = false;
            if (!(Canvas.promptingShapeStartPoint === null)) {
                Canvas.drawPromptingShape(shape.getAttr('x'), shape.getAttr('y'));
            }
            else if (Canvas.currentlyComplexShape == ComplexShapeEnum.PERPENDICULAR_LINE) {
                Canvas.drawPromptingShape(shape.getAttr('x'), shape.getAttr('y'));
            }
            else if (Canvas.currentlyComplexShape == ComplexShapeEnum.PARALLEL_LINE) {
                Canvas.drawPromptingShape(shape.getAttr('x'), shape.getAttr('y'));
            }
        });

        // bind function for mouse out a point
        shape.on("mouseout", function () {
            Canvas.drawGuideLines = true;

            if (!(Canvas.activatedShapes.includes(shape.getAttr('id')))) {
                shape.radius(Appearance.pointRadius);
                shape.fill(Appearance.basicShapesColor);
            }
            else {
                shape.radius(Appearance.activatedPointRadius);
                shape.fill(Appearance.activatedShapesColor);
            }

            Canvas.drawPromptingShapes = true;
        });

        // bind function for mouse click on point
        shape.on("click", function (evt) {
            evt.cancelBubble = true;

            Canvas.drawPromptingShapes = true;

            if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.NONE) {
                return;
            }
            else if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.COMPLEX_SHAPE) {
                //ComplexShapeCreator.clickedOnPoint(shape.getAttr('id'));
                ComplexShapeCreator.clickedOnPoint(parseInt(shape.getAttr('id').substr(2)));
            }
            else {
                CanvasManagerInterface.clickedOnPoint(parseInt(shape.getAttr('id').substr(2)));
            }

        });

        // creating point name text if variable showPointLabels is true
        if (Appearance.showPointLabels) {
            let pointName = Canvas.createPointName();
            let nameText = new Konva.Text({
                id: "txt" + id,
                x: x_coordinate + 5,
                y: y_coordinate + 5,
                text: pointName,
                fontSize: Appearance.textSize,
                fontFamily: Appearance.textFont,
                fontStyle: Appearance.textFontStyle,
                fill: Appearance.textColor,
                draggable: true,
            });

            // bind funtion for mouse over a text
            nameText.on("mouseover", function () {
                nameText.fill(Appearance.mouseoverShapesColor);
                nameText.fontStyle("bold");
            });

            // bind function for mouse out a text
            nameText.on("mouseout", function () {
                nameText.fill(Appearance.textColor);
                nameText.fontStyle(Appearance.textFontStyle);
            });

            // add text to layer

            Canvas.shapesLayer.add(nameText);
            nameText.zIndex(Canvas.TEXT_Z_INDEX);

            // save point name in pointNames array
            Canvas.pointNames[id] = pointName;
        }

        if (x_coordinate >= 0 && x_coordinate <= Canvas.getWidth() && y_coordinate >= 0 && y_coordinate <= Canvas.getHeight()) {
            Canvas.guideLineX.push(x_coordinate);
            Canvas.guideLineY.push(y_coordinate);
        }

        // add shape to layer

        Canvas.shapesLayer.add(shape);
        shape.setAttr('objectType', 'POINT');
        shape.zIndex(Canvas.POINT_Z_INDEX);
        Canvas.pointIdCounter += 1;
        Canvas.shapeIdCounter += 1;

        Canvas.lastCreatedPointId = id;

        Canvas.shapesLayer.draw();
    }

    /**
     * Drawing segment on canvas.
     * @param x1_coordinate X coordinate of first segment end
     * @param y1_coordinate Y coordinate of first segment end
     * @param x2_coordinate X coordinate of second segment end
     * @param y2_coordinate Y coordinate of second segment end
     * @param id shape ID to set
     */
    public static drawLine(id: number, x1_coordinate: number, y1_coordinate: number, x2_coordinate: number, y2_coordinate: number): void {
        let shape = new Konva.Line({
            id: "id" + id,
            points: [x1_coordinate, y1_coordinate, x2_coordinate, y2_coordinate],
            stroke: Appearance.basicShapesColor,
            strokeWidth: Appearance.linesStrokeWidth,
            hitStrokeWidth: Appearance.linesHitStrokeWidth,
            lineCap: (Appearance.linesCap as CanvasLineCap),
            lineJoin: (Appearance.linesJoin as CanvasLineJoin),
        });

        // bind funtion for mouse over a line
        shape.on("mouseover", function () {
            shape.strokeWidth(Appearance.mouseoverLinesStrokeWidth);
            shape.stroke(Appearance.mouseoverShapesColor);

            let clickPosition = Canvas.shapesLayer.getRelativePointerPosition();
            let clickX: number;
            let clickY: number;

            if (Canvas.currentGuideLineX) { clickX = Canvas.currentGuideLineX; }
            else { clickX = clickPosition.x; }

            if (Canvas.currentGuideLineY) { clickY = Canvas.currentGuideLineY; }
            else { clickY = clickPosition.y; }

            if (!(Canvas.promptingShapeStartPoint === null)) {
                Canvas.drawPromptingShape(clickX, clickY);
            }
        });

        // bind funtion for mouse out a line
        shape.on("mouseout", function () {
            if (!(Canvas.activatedShapes.includes(shape.getAttr('id')))) {
                shape.strokeWidth(Appearance.linesStrokeWidth);
                shape.stroke(Appearance.basicShapesColor);
            }
            else {
                shape.strokeWidth(Appearance.activatedLinesStrokeWidth);
                shape.stroke(Appearance.activatedShapesColor);
            }
        });

        // bind function for mouse click on line
        shape.on("click", function (evt) {
            evt.cancelBubble = true;

            if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.NONE)
                return;

            let clickPosition = Canvas.shapesLayer.getRelativePointerPosition();
            let clickX: number;
            let clickY: number;

            if (Canvas.currentGuideLineX) { clickX = Canvas.currentGuideLineX; }
            else { clickX = clickPosition.x; }

            if (Canvas.currentGuideLineY) { clickY = Canvas.currentGuideLineY; }
            else { clickY = clickPosition.y; }

            if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.COMPLEX_SHAPE) {
                ComplexShapeCreator.clickedOnLine(parseInt(shape.getAttr('id').substr(2)), clickX, clickY, Canvas.shapeIdCounter);
            }
            else {
                CanvasManagerInterface.clickedOnSegment(parseInt(shape.getAttr('id').substr(2)), clickX, clickY);
            }
        });

        // add shape to layer

        Canvas.shapesLayer.add(shape);
        shape.setAttr('objectType', 'SEGMENT');
        shape.zIndex(Canvas.LINE_Z_INDEX);
        Canvas.shapeIdCounter += 1;

        Canvas.lastCreatedSegmentId = id;

        Canvas.shapesLayer.draw();
    }

    /**
     * Drawing circle on canvas.
     * @param x_coordinate X coordinate of circle center
     * @param y_coordinate Y coordinate of circle center
     * @param radius circle radius length
     * @param id shape ID to set
     */
    public static drawCircle(id: number, x_coordinate: number, y_coordinate: number, radius: number): void {
        let shape = new Konva.Arc({
            id: "id" + id,
            x: x_coordinate,
            y: y_coordinate,
            radius: radius,
            innerRadius: radius,
            outerRadius: radius,
            angle: 360,
            rotation: 0,
            strokeWidth: Appearance.linesStrokeWidth,
            stroke: Appearance.basicShapesColor,
            fillEnabled: false,
        });

        // bind funtion for mouse over a circle
        shape.on("mouseover", function () {
            shape.strokeWidth(4);
            shape.stroke(Appearance.mouseoverShapesColor);

            let clickPosition = Canvas.shapesLayer.getRelativePointerPosition();
            let clickX: number;
            let clickY: number;

            if (Canvas.currentGuideLineX) { clickX = Canvas.currentGuideLineX; }
            else { clickX = clickPosition.x; }

            if (Canvas.currentGuideLineY) { clickY = Canvas.currentGuideLineY; }
            else { clickY = clickPosition.y; }

            if (!(Canvas.promptingShapeStartPoint === null)) {
                Canvas.drawPromptingShape(clickX, clickY);
            }
        });

        // bind funtion for mouse out a line
        shape.on("mouseout", function () {
            if (!(Canvas.activatedShapes.includes(shape.getAttr('id')))) {
                shape.strokeWidth(Appearance.linesStrokeWidth);
                shape.stroke(Appearance.basicShapesColor);
            }
            else {
                shape.strokeWidth(Appearance.activatedLinesStrokeWidth);
                shape.stroke(Appearance.activatedShapesColor);
            }
        });

        // bind funtion for mouse click on circle
        shape.on("click", function (evt) {
            evt.cancelBubble = true;

            if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.NONE)
                return;

            let clickPosition = Canvas.shapesLayer.getRelativePointerPosition();
            let clickX: number;
            let clickY: number;

            if (Canvas.currentGuideLineX) { clickX = Canvas.currentGuideLineX; }
            else { clickX = clickPosition.x; }

            if (Canvas.currentGuideLineY) { clickY = Canvas.currentGuideLineY; }
            else { clickY = clickPosition.y; }

            if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.COMPLEX_SHAPE) {
                ComplexShapeCreator.clickedOnCircle(parseInt(shape.getAttr('id').substr(2)), clickX, clickY, Canvas.shapeIdCounter);
            }
            else {
                CanvasManagerInterface.clickedOnCircle(parseInt(shape.getAttr('id').substr(2)), clickX, clickY);
            }
        });


        Canvas.shapesLayer.add(shape);
        shape.setAttr('objectType', 'CIRCLE');
        shape.zIndex(Canvas.CIRCLE_Z_INDEX);
        Canvas.shapeIdCounter += 1;

        Canvas.lastCreatedCircleId = id;

        Canvas.shapesLayer.draw();
    }

    /**
     * Creating instance of moving point.
     * @param x_coordinate X coordinate of mpving point
     * @param y_coordinate Y coordinate of moving point
     * @param function_on_move function to apply when moving point is dragged
     */
    public static createMovingPromptingPoint(x_coordinate: number, y_coordinate: number, function_on_move: (x: number, y: number) => [number, number]): void {
        let shape = new Konva.Circle({
            id: 'mp',
            x: x_coordinate,
            y: y_coordinate,
            fill: Appearance.promptingShapesColor,
            radius: Appearance.pointRadius,
            hitStrokeWidth: Appearance.pointHitStrokeWidth,
            draggable: true,
        });

        shape.on("mouseover", function () {
            shape.radius(Appearance.mouseoverPointRadius);
            shape.fill(Appearance.mouseoverShapesColor);
        });

        shape.on("mouseout", function () {
            shape.radius(Appearance.pointRadius);
            shape.fill(Appearance.promptingShapesColor);
        });

        shape.on('dragstart', function () {
            this.moveToTop();
        });

        shape.on('dragmove', () => {
            let new_coord = function_on_move(shape.getAttr('x'), shape.getAttr('y'));

            shape.x(new_coord[0]);
            shape.y(new_coord[1]);

            Canvas.findGuideLines(new_coord[0], new_coord[1]);
        });

        shape.on('dragend', function () {
            Canvas.findGuideLines(shape.getAttr('x'), shape.getAttr('y'));
            Canvas.guideLayer.destroyChildren();
            if (Canvas.currentGuideLineX) { shape.x(Canvas.currentGuideLineX); }
            if (Canvas.currentGuideLineY) { shape.y(Canvas.currentGuideLineY); }

            ComplexShapeCreator.setMovingPointCoordinate(shape.getAttr('x'), shape.getAttr('y'));
        });


        Canvas.shapesLayer.add(shape);
        shape.zIndex(Canvas.POINT_Z_INDEX);
        Canvas.movingPromptingPoint = shape;
    }

    /**
     * Deleting created instance of moving point.
     */
    public static deleteMovingPromptingPoint(): void {
        try {
            Canvas.movingPromptingPoint.destroy();
        } catch { }
    }

    /**
     * Non-blocking waiting for the shape to appear .
     * @param id ID of shape to appear
     */
    public static waitForShapeAppear(id: number): void {
        (function loopSearch() {
            if (Canvas.stage.find('#id' + id)[0]) {
                return;
            }
            else {
                setTimeout(function () {
                    loopSearch();
                }, 10);
            }
        })();
    }

    /**
     * Activate shapes.
     * @param shape_ids array with shape IDs to activate
     */
    public static activateShapes(shape_ids: number[]): void {
        Canvas.activatedShapes.forEach(element => {
            if (Canvas.shapesLayer.find('#' + element)[0].getAttr('objectType') == 'POINT') {
                Canvas.shapesLayer.find('#' + element)[0].setAttr('fill', Appearance.basicShapesColor);
                Canvas.shapesLayer.find('#' + element)[0].setAttr('radius', Appearance.pointRadius);
            }
            else {
                Canvas.shapesLayer.find('#' + element)[0].setAttr('stroke', Appearance.basicShapesColor);
                Canvas.shapesLayer.find('#' + element)[0].setAttr('strokeWidth', Appearance.linesStrokeWidth);
            }
        });
        shape_ids.forEach(element => {
            if (Canvas.shapesLayer.find('#id' + element)[0].getAttr('objectType') == 'POINT') {
                Canvas.shapesLayer.find('#id' + element)[0].setAttr('fill', Appearance.activatedShapesColor);
                Canvas.shapesLayer.find('#id' + element)[0].setAttr('radius', Appearance.activatedPointRadius);
            }
            else {
                Canvas.shapesLayer.find('#id' + element)[0].setAttr('stroke', Appearance.activatedShapesColor);
                Canvas.shapesLayer.find('#id' + element)[0].setAttr('strokeWidth', Appearance.activatedLinesStrokeWidth);
            }
        });

        Canvas.activatedShapes = shape_ids.map((element) => { return 'id' + element; });

    }

    /**
     * Drawing prompting segment.
     * @param point1_x X coordinate of first segment end
     * @param point1_y Y coordinate of first segment end
     * @param point2_x X coordinate of second segment end
     * @param point2_y Y coordinate of second segment end
     */
    private static drawPromptingSegment(point1_x: number, point1_y: number, point2_x: number, point2_y: number): void {
        Canvas.batchLayer.destroyChildren();
        let shape = new Konva.Line({
            points: [point1_x, point1_y, point2_x, point2_y],
            stroke: Appearance.promptingShapesColor,
            strokeWidth: Appearance.linesStrokeWidth,
            lineCap: (Appearance.linesCap as CanvasLineCap),
            lineJoin: (Appearance.linesJoin as CanvasLineJoin),
        });

        Canvas.batchLayer.add(shape);
    }

    /**
     * Drawing prompting shape on base currently mouse position.
     * @param mouse_x_position X coordinate of mouse position
     * @param mouse_y_position Y coordinate of mouse position
     */
    private static drawPromptingShape(mouse_x_position: number, mouse_y_position: number): void {
        if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.SEGMENT) {
            if (Canvas.currentGuideLineX) {
                Canvas.drawPromptingSegment(Canvas.promptingShapeStartPoint![0], Canvas.promptingShapeStartPoint![1],
                    Canvas.currentGuideLineX, mouse_y_position);
            }
            else if (Canvas.currentGuideLineY) {
                Canvas.drawPromptingSegment(Canvas.promptingShapeStartPoint![0], Canvas.promptingShapeStartPoint![1],
                    mouse_x_position, Canvas.currentGuideLineY);
            }
            else {
                Canvas.drawPromptingSegment(Canvas.promptingShapeStartPoint![0], Canvas.promptingShapeStartPoint![1],
                    mouse_x_position, mouse_y_position);
            }
        }
        else if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.LINE) {
            if (Canvas.compareNumbers(Canvas.promptingShapeStartPoint![0], mouse_x_position, 0.1) && Canvas.compareNumbers(Canvas.promptingShapeStartPoint![1], mouse_y_position, 0.1)) {
                return;
            }

            if (Canvas.currentGuideLineX && Canvas.compareNumbers(Canvas.promptingShapeStartPoint![0], Canvas.currentGuideLineX, 0.1)) {
                Canvas.drawPromptingSegment(Canvas.currentGuideLineX, Canvas.height, Canvas.currentGuideLineX, 0);
            }
            else if (Canvas.currentGuideLineY && Canvas.compareNumbers(Canvas.promptingShapeStartPoint![1], Canvas.currentGuideLineY, 0.1)) {
                Canvas.drawPromptingSegment(Canvas.width, Canvas.currentGuideLineY, 0, Canvas.currentGuideLineY);
            }
            else {
                let x1, x2, y1, y2: number;
                if (Canvas.promptingShapeStartPoint![0] < mouse_x_position) {
                    x1 = Canvas.promptingShapeStartPoint![0];
                    y1 = Canvas.promptingShapeStartPoint![1];
                    x2 = mouse_x_position;
                    y2 = mouse_y_position;
                }
                else {
                    x2 = Canvas.promptingShapeStartPoint![0];
                    y2 = Canvas.promptingShapeStartPoint![1];
                    x1 = mouse_x_position;
                    y1 = mouse_y_position;
                }

                let a = (y1 - y2) / (x1 - x2);
                let b = y1 - a * x1;

                x1 = (Canvas.height - b) / a;
                x2 = (-b) / a;

                if (a > 0) {
                    if (x1 < 0)
                        x1 = 0;
                    if (x2 > Canvas.width)
                        x2 = Canvas.width
                }
                else {
                    if (x2 < 0)
                        x2 = 0;
                    if (x1 > Canvas.width)
                        x1 = Canvas.width
                }

                Canvas.drawPromptingSegment(x1, a * x1 + b, x2, a * x2 + b);
            }
        }
        else if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.SEMILINE) {
            if (Canvas.compareNumbers(Canvas.promptingShapeStartPoint![0], mouse_x_position, 0.1) && Canvas.compareNumbers(Canvas.promptingShapeStartPoint![1], mouse_y_position, 0.1)) {
                return;
            }

            if (Canvas.currentGuideLineX && Canvas.compareNumbers(Canvas.promptingShapeStartPoint![0], Canvas.currentGuideLineX, 0.1)) {
                if (Canvas.promptingShapeStartPoint![1] < mouse_y_position)
                    Canvas.drawPromptingSegment(Canvas.currentGuideLineX, Canvas.height, Canvas.currentGuideLineX, Canvas.promptingShapeStartPoint![1]);
                else
                    Canvas.drawPromptingSegment(Canvas.currentGuideLineX, Canvas.promptingShapeStartPoint![1], Canvas.currentGuideLineX, 0);
            }
            else if (Canvas.currentGuideLineY && Canvas.compareNumbers(Canvas.promptingShapeStartPoint![1], Canvas.currentGuideLineY, 0.1)) {
                if (Canvas.promptingShapeStartPoint![0] < mouse_x_position)
                    Canvas.drawPromptingSegment(Canvas.width, Canvas.currentGuideLineY, Canvas.promptingShapeStartPoint![0], Canvas.currentGuideLineY);
                else
                    Canvas.drawPromptingSegment(Canvas.promptingShapeStartPoint![0], Canvas.currentGuideLineY, 0, Canvas.currentGuideLineY);
            }
            else {
                let x1, x2, y1, y2: number;
                if (Canvas.promptingShapeStartPoint![0] < mouse_x_position) {
                    x1 = Canvas.promptingShapeStartPoint![0];
                    y1 = Canvas.promptingShapeStartPoint![1];
                    x2 = mouse_x_position;
                    y2 = mouse_y_position;
                }
                else {
                    x2 = Canvas.promptingShapeStartPoint![0];
                    y2 = Canvas.promptingShapeStartPoint![1];
                    x1 = mouse_x_position;
                    y1 = mouse_y_position;
                }

                let a = (y1 - y2) / (x1 - x2);
                let b = y1 - a * x1;

                x1 = (Canvas.height - b) / a;
                x2 = (-b) / a;

                if (a > 0) {
                    if (x1 < 0)
                        x1 = 0;
                    if (x2 > Canvas.width)
                        x2 = Canvas.width

                    if (Canvas.promptingShapeStartPoint![0] > mouse_x_position)
                        x1 = Canvas.promptingShapeStartPoint![0]
                    else
                        x2 = Canvas.promptingShapeStartPoint![0]
                }
                else {
                    if (x2 < 0)
                        x2 = 0;
                    if (x1 > Canvas.width)
                        x1 = Canvas.width

                    if (Canvas.promptingShapeStartPoint![0] > mouse_x_position)
                        x2 = Canvas.promptingShapeStartPoint![0]
                    else
                        x1 = Canvas.promptingShapeStartPoint![0]
                }

                Canvas.drawPromptingSegment(x1, a * x1 + b, x2, a * x2 + b);
            }
        }
        else if (Canvas.currentlyCreatedShape == ShapeToCreateEnum.CIRCLE) {
            Canvas.batchLayer.destroyChildren();
            let xs = Canvas.promptingShapeStartPoint![0] - mouse_x_position;
            let ys = Canvas.promptingShapeStartPoint![1] - mouse_y_position;
            let r = Math.sqrt(xs * xs + ys * ys)

            let shape = new Konva.Arc({
                x: Canvas.promptingShapeStartPoint![0],
                y: Canvas.promptingShapeStartPoint![1],
                innerRadius: r,
                outerRadius: r,
                angle: 360,
                strokeWidth: Appearance.linesStrokeWidth,
                stroke: Appearance.promptingShapesColor,
                fillEnabled: false,
            });

            Canvas.batchLayer.add(shape);
        }
        else if (Canvas.currentlyComplexShape == ComplexShapeEnum.PERPENDICULAR_LINE) {
            Canvas.batchLayer.destroyChildren();
            if (Canvas.baseToPromptingLine) {
                if (Canvas.baseToPromptingLine[0] === null) { // x = b
                    Canvas.drawPromptingSegment(0, mouse_y_position, Canvas.getWidth(), mouse_y_position);
                }
                else if (Canvas.compareNumbers(Canvas.baseToPromptingLine[0], 0, 0.01)) { // y = b
                    Canvas.drawPromptingSegment(mouse_x_position, 0, mouse_x_position, Canvas.getHeight());
                }
                else { // y = ax+b
                    let a = -1 / Canvas.baseToPromptingLine[0];
                    let b = mouse_y_position - a * mouse_x_position;
                    Canvas.drawPromptingSegment(0, b, Canvas.getWidth(), a * Canvas.getWidth() + b);
                }
            }
        }
        else if (Canvas.currentlyComplexShape == ComplexShapeEnum.PARALLEL_LINE) {
            Canvas.batchLayer.destroyChildren();
            if (Canvas.baseToPromptingLine) {
                if (Canvas.baseToPromptingLine[0] === null) { // x = b

                    Canvas.drawPromptingSegment(mouse_x_position, 0, mouse_x_position, Canvas.getHeight());
                }
                else { // y = ax+b
                    let a = Canvas.baseToPromptingLine[0];
                    let b = mouse_y_position - a * mouse_x_position;
                    Canvas.drawPromptingSegment(0, b, Canvas.getWidth(), a * Canvas.getWidth() + b);
                }
            }
        }
    }

    /**
     * Drawing prompting polygon.
     * @param points array with arrays representing polygon vertices
     */
    public static drawPromptingPolygon(points: [number, number][]): void {
        Canvas.batchLayer.destroyChildren();

        let polygonPoints = [];
        for (let i = 0; i < points.length; i++) {
            polygonPoints.push(points[i][0]);
            polygonPoints.push(points[i][1]);
        }

        let shape = new Konva.Line({
            points: polygonPoints,
            stroke: Appearance.promptingShapesColor,
            strokeWidth: 2,
            lineCap: "round",
            lineJoin: "round",
            closed: true
        });

        Canvas.batchLayer.add(shape);
    }

    /**
     * Comparison of numbers in a certain predetermined accuracy 
     * @param a first number to compare
     * @param b second number to compare
     * @param epsilon accuracy of comparation
     * @returns true if a is equal b with accuracy epsilon, otherwise false
     */
    public static compareNumbers(a: number, b: number, epsilon: number): boolean {
        return Math.abs(a - b) <= epsilon;
    }

    public static highlightPoint(x: number, y: number, fillColor: string): void {
        let shape = new Konva.Circle({
            x: x,
            y: y,
            fill: fillColor,
            radius: Appearance.pointRadius,
        });

        Canvas.highlightLayer.add(shape);
    }

    public static highlightPolyLine(vertices: [number, number][], closed: boolean, outlineColor: string, fillColor: string | null): void {
        let coordinates: number[] = [];
        vertices.forEach(element => {
            coordinates.push(element[0]);
            coordinates.push(element[1]);
        });

        var shape = new Konva.Line({
            points: coordinates,
            stroke: outlineColor,
            strokeWidth: Appearance.linesStrokeWidth,
            lineCap: (Appearance.linesCap as CanvasLineCap),
            lineJoin: (Appearance.linesJoin as CanvasLineJoin),
            closed: closed,
        });

        if (fillColor) {
            shape.fill(fillColor);
        }

        Canvas.highlightLayer.add(shape);
    }

    public static highlightAngle(arm1Point: [number, number], vertexPoint: [number, number], arm2Point: [number, number], isConvex: boolean, fillColor: string, ratio: [number, number]): void {
        Canvas.highlightPolyLine([arm1Point, vertexPoint, arm2Point], false, fillColor, null);
        if (arm1Point[0] == arm2Point[0] && arm1Point[1] == arm2Point[1] && arm1Point[0] == vertexPoint[0] && arm1Point[1] == vertexPoint[1]) {
            if (!isConvex) {
                Canvas.highlightCircle(vertexPoint[0], vertexPoint[1], 25, fillColor, null)
            }
        }
        else if (arm1Point[0] != arm2Point[0] || arm1Point[1] != arm2Point[1]) {
            let ratioSum = ratio[0] + ratio[1];

            let end1X = (ratio[1] * arm1Point[0] + ratio[0] * vertexPoint[0]) / ratioSum;
            let end1Y = (ratio[1] * arm1Point[1] + ratio[0] * vertexPoint[1]) / ratioSum;
            let end2X = (ratio[1] * arm2Point[0] + ratio[0] * vertexPoint[0]) / ratioSum;
            let end2Y = (ratio[1] * arm2Point[1] + ratio[0] * vertexPoint[1]) / ratioSum;
            let controlX: number, controlY: number;
            if (isConvex) {
                controlX = (arm1Point[0] + arm2Point[0]) / 2;
                controlY = (arm1Point[1] + arm2Point[1]) / 2;
            }
            else {
                controlX = 2 * vertexPoint[0] - ((arm1Point[0] + arm2Point[0]) / 2);
                controlY = 2 * vertexPoint[1] - ((arm1Point[1] + arm2Point[1]) / 2);
            }

            var shape = new Konva.Shape({
                stroke: fillColor,
                strokeWidth: Appearance.linesStrokeWidth,
                sceneFunc: (ctx, s) => {
                    ctx.beginPath();
                    ctx.moveTo(end1X, end1Y);
                    ctx.quadraticCurveTo(
                        controlX, controlY,
                        end2X, end2Y
                    );
                    ctx.fillStrokeShape(s);
                },
            });

            Canvas.highlightLayer.add(shape);
        }
        else if (!isConvex) {
            let distance = Math.sqrt(Math.pow(arm1Point[0] - vertexPoint[0], 2) + Math.pow(arm1Point[1] - vertexPoint[1], 2));
            let distancePart = distance / (ratio[0] + ratio[1]);
            Canvas.highlightCircle(vertexPoint[0], vertexPoint[1], distancePart * ratio[0], fillColor, null)
        }
    }

    public static highlightCircle(x: number, y: number, radius: number, outlineColor: string, fillColor: string | null): void {
        let shape = new Konva.Circle({
            x: x,
            y: y,
            radius: radius,
            stroke: outlineColor,
        });

        if (fillColor) {
            shape.fill(fillColor);
        }

        Canvas.highlightLayer.add(shape);
    }

    public static clearHighlightedShapes(): void {
        Canvas.highlightLayer.destroyChildren();
    }

    /**
     * Creating point name on base current point id counter.
     * @returns point name of currently created point
     */
    private static createPointName(): string {
        let n = Canvas.pointIdCounter;
        let name = Appearance.capitalLetters.charAt(n % Appearance.capitalLetters.length);

        // if there are more points than letters of the alphabet, add apostrophes 
        while (n > (Appearance.capitalLetters.length - 1)) {
            name += "'";
            n -= Appearance.capitalLetters.length;
        }

        return name;
    }

    /**
     * Finding and creating guide lines for specific mouse position
     * @param x X coordinate of mouse position
     * @param y Y coordinate of mouse position
     */
    private static findGuideLines(x: number, y: number): void {
        let minimalXdistance = Number.POSITIVE_INFINITY;
        let theBestX = 0;
        let minimalYdistance = Number.POSITIVE_INFINITY;
        let theBestY = 0;

        Canvas.guideLineX.forEach((val) => {
            let distance = Math.abs(val - x);
            if (distance < minimalXdistance) {
                minimalXdistance = distance;
                theBestX = val;
            }
        });

        Canvas.guideLineY.forEach((val) => {
            let distance = Math.abs(val - y);
            if (distance < minimalYdistance) {
                minimalYdistance = distance;
                theBestY = val;
            }
        });

        Canvas.guideLayer.destroyChildren();

        if (minimalXdistance > Appearance.guideLineOffset) {
            Canvas.currentGuideLineX = null;
        }
        else if (Canvas.drawGuideLines) {
            Canvas.currentGuideLineX = theBestX;

            let line = new Konva.Line({
                points: [theBestX, 0, theBestX, Canvas.getHeight()],
                stroke: Appearance.guideLinesColor,
                strokeWidth: Appearance.guideLinesStrokeWidth,
                dash: [4, 6],
                lineCap: (Appearance.linesCap as CanvasLineCap),
                lineJoin: (Appearance.linesJoin as CanvasLineJoin),
            });
            Canvas.guideLayer.add(line);
        }

        if (minimalYdistance > Appearance.guideLineOffset) {
            Canvas.currentGuideLineY = null;
        }
        else if (Canvas.drawGuideLines) {
            Canvas.currentGuideLineY = theBestY;

            let line = new Konva.Line({
                points: [0, theBestY, Canvas.getWidth(), theBestY],
                stroke: Appearance.guideLinesColor,
                strokeWidth: Appearance.guideLinesStrokeWidth,
                dash: [4, 6],
                lineCap: (Appearance.linesCap as CanvasLineCap),
                lineJoin: (Appearance.linesJoin as CanvasLineJoin),
            });
            Canvas.guideLayer.add(line);
        }
    }
}
