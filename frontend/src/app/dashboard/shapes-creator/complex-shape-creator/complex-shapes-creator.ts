/**
 * Module contains a static class ComplexShapeCreator for creating complex geometric shapes 
 * or constructions and an enum ShapeToSelect for selecting the necessary shapes for ComplexShapeCreator purpose.
 * 
 * @module Complex Shapes Creator
 */

import { BehaviorSubject } from "rxjs";
import { Canvas, ComplexShapeEnum } from "../../canvas";
import { CanvasManagerInterface, PolygonTypeEnum, ShapeToCreateEnum } from "../../canvas-manager-interface";

/**
 * Enum holds available shapes to select to create complex shapes or geometric constructions.
 */
export enum ShapeToSelect {
    EXISTING_POINT,
    NEW_POINT_CLICK_ON_CANVAS,
    NEW_POINT_CLICK_ON_SEGMENT,
    NEW_POINT_CLICK_ON_CIRCLE,
    SEGMENT,
    SEGMENT_ENDS,
    CIRCLE
}

/**
 * Enum holds available shape transformations.
 */
export enum AvailableTransformation {
    NONE = 0,
    // basic transformations:
    TRANSLATE_X = 1,
    TRANSLATE_Y = 2,
    TRANSLATE = 3,
    SCALE_X = 4,
    SCALE_Y = 8,
    SCALE_XY = 16,
    SCALE = 28,
    ROTATE = 32,
    ALL_BASIC = 63,
    // special transformations:
    CHANGE_SIDE = 64,
    MIRROR_X = 128,
    MIRROR_Y = 256,
    MIRROR = 384,
    ALL_SPECIAL = 448,
    // additional transformation:
    MOVING_POINT = 512,
    REVERSE = 1024,
}

/**
 * Enum holds available drag range types.
 */
export enum DragRangeType {
    NONE,
    ISOSCELES_TRIANGLE_ARM,
    ISOSCELES_TRIANGLE_BASE,
    RIGHT_TRIANGLE,
    RIGHT_TRIANGLE_CATHETUS,
    RECTANGLE,
    PARALLELOGRAM,
    RHOMBUS,
    KITE,
    RIGHT_TRAPEZOID_BASE,
    ISOSCELES_TRAPEZOID_BASE,
}

export enum DependeciesSetToSet {
    NONE,
    ISOSCELES_ACUTE_TRIANGLE,
    EQUILATERAL_TRIANGLE,
    SCALENE_RIGHT_TRIANGLE,
    ISOSCELES_RIGHT_TRIANGLE,
    OBTUSE_ISOSCELES_TRIANGLE,
    SQUARE,
    RECTANGLE,
    REGULAR_POLYGON,
    PARALLELOGRAM,
    KITE,
    RHOMBUS,
    SCALENE_TRAPEZOID,
    ISOSCELES_TRAPEZOID,
    RIGHT_TRAPEZOID
}

/**
 * Static class which managers creating complex shapes and geometric constructions.
 */
export class ComplexShapeCreator {
    public static displayComplexShapeCreator$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /** Behavior Subject variable used to define if instructions should be displayed on dashboard. */
    public static displayInstructions$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /** Behavior Subject variable used to define if buttons to modify creating polygon should be displayed on dashboard. */
    public static displayPolygonMovement$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /** Behavior Subject variable used to define title of instructions displayed on dashboard. */
    public static titleToSet$: BehaviorSubject<string> = new BehaviorSubject<string>("");

    /** Behavior Subject variable used to define instructions displayed on dashboard. */
    public static instructionToSet$: BehaviorSubject<string> = new BehaviorSubject<string>("");

    /** Behavior Subject variable used to define type of available configuration on dashboard. */
    public static availableTransformationType$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    /** Behavior Subject variable used to define if moving point alert should be displayed. */
    public static displayMovingPointAlert$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /** Behavior Subject variable used to define moving point alert displayed on dashboard */
    public static movingPointAlert$: BehaviorSubject<string> = new BehaviorSubject<string>("");

    /** Array with ShapeToSelect elements arrays. It defines order in which the shapes are selected.
     * In one step it is possible to select different shapes. */
    private static shapesToClick: (ShapeToSelect[])[];

    /** Function to be executed after selection of given shapes of given types. */
    private static functionToDo: Function

    /** Array with shape IDs which have already been clicked. */
    private static shapesClicked: ([number] | [number, number])[];

    /** Counter of already selected shapes. */
    private static counter: number;

    /** Array with point IDs which represent segment ends(used to select ShapeToSelect.SEGMENT_ENDS type shape). */
    private static segmentEndsChoosing: number[];

    /** Constant value used to scale the size of created shapes.
     * ComplexShapeCreator makes the size of the created shapes dependent of the size of the canvas. */
    private static unitDivisor: number = 44;

    /** Array with arrays representing coordinates of start unit vertices of the currently created shape. */
    private static startVertices: [number, number][];

    /** Array with arrays representing coordinates of currently calculated vertices of the currently created shape.*/
    private static currentPoints: [number, number][];

    private static fixedVerticesIds: number[];

    /** Array with arrays representing coordinates of fixed points. 
     * Fixed points are points that cannot be modified by the user. */
    private static fixedVertices: [number, number][];

    /** Number indicating whether the fixedVertices array should be processed from the beginning or from the end.  */
    private static fixedVerticesStartPoint: number;

    /** Counter indicating the shape transformation currently being processed. */
    private static transformationsCounter: number;

    /** Array of array containing the order in which shape vertices should be processed. */
    private static parsedSidesOrder: number[][];

    /** The numbers of vertices of the shape which form a segment parallel to the OX axis. */
    private static oxAxis: [number, number];

    /** Array of numbers specifying possible transformations. 
     * {@link AvailableTransformation }'s are combined using the logical operator OR. */
    private static availableTransformations: number[];

    /** Array with functions that take the current coordinates of the points of the shape to be created, 
     * which must return true to validate the shape's creation. */
    private static confirmationFunctions: (((endVertices: [number, number][]) => boolean) | null)[];

    /** Array of drag range types used to limit movement of moving point. */
    private static dragRanges: DragRangeType[];

    private static polygonType: DependeciesSetToSet;

    /** Empty function: static class has no constructor. */
    constructor() { }

    /**
     * Calculating shape size unit value for a given canva.
     * The value is negative because the axes in canva are reversed relative to the Cartesian system. 
     * @returns value of calculated unit
     */
    public static getUnit(): number {
        return -Math.min(Canvas.getScreenWidth(), Canvas.getScreenHeight()) / ComplexShapeCreator.unitDivisor;
    }

    /**
     * Start choosing shapes to create complex shape or geometrical construction.
     * @param title title of instructions to set
     * @param shapes array with shapes arrays to select
     * @param functionToDo function to apply after selection of given shapes with given types
     */
    public static chooseShapes(title: string, shapes: (ShapeToSelect[])[], functionToDo: Function): void {
        Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.COMPLEX_SHAPE);
        ComplexShapeCreator.counter = 0;
        ComplexShapeCreator.shapesToClick = shapes;
        ComplexShapeCreator.functionToDo = functionToDo;
        ComplexShapeCreator.shapesClicked = [];
        ComplexShapeCreator.segmentEndsChoosing = [];

        ComplexShapeCreator.titleToSet$.next(title);
        ComplexShapeCreator.instructionToSet$.next(ComplexShapeCreator.getInstructions());
        ComplexShapeCreator.displayComplexShapeCreator$.next(true);
        ComplexShapeCreator.displayInstructions$.next(true);
    }

    /**
     * Cancel choosing shapes to create complex shape or geometrical construction.
     */
    public static cancelChoosing(): void {
        Canvas.setCurrentlyComplexShape(ComplexShapeEnum.NONE);
        Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.NONE);
        Canvas.setBaseToPromptingLine(null);
        ComplexShapeCreator.displayComplexShapeCreator$.next(false);
        ComplexShapeCreator.displayInstructions$.next(false);
        ComplexShapeCreator.titleToSet$.next("");
        ComplexShapeCreator.instructionToSet$.next("");
        Canvas.activateShapes([]);
        Canvas.clearBatchLayer();
    }

    /**
     * Check if event from {@link Canvas} - click on canvas - matches to the currenty required shape type to select.
     * If it matches process event.
     * @param x X coordinate of click
     * @param y Y coordinate of click 
     * @param next_id ID to set for new created shape
     */
    public static clickedOnCanvas(x: number, y: number, next_id: number): void {
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.NEW_POINT_CLICK_ON_CANVAS)) {
            ComplexShapeCreator.shapesClicked.push([next_id]);
            CanvasManagerInterface.clickedOnCanvas(x, y);
            Canvas.waitForShapeAppear(next_id);
            ComplexShapeCreator.afterClickedOnShape();
        }
    }

    public static arrayIncludesId(array: ([number] | [number, number])[], id: ([number] | [number, number])): boolean {
        for (let i = 0; i < array.length; i++) {
            if (array[i].length == 1 && id.length == 1) {
                if (array[i][0] == id[0]) {
                    return true;
                }
            }
            else if (array[i].length == 2 && id.length == 2) {
                if (array[i][0] == id[0] && array[i][1] == id[1]) {
                    return true;
                }
                else if (array[i][0] == id[1] && array[i][1] == id[0]) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if event from {@link Canvas} - click on point - matches to the currenty required shape type to select.
     * If it matches process event.
     * @param id ID of clicked shape
     */
    public static clickedOnPoint(id: number): void {
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.EXISTING_POINT)) {
            if (!ComplexShapeCreator.arrayIncludesId(ComplexShapeCreator.shapesClicked, [id])) {
                ComplexShapeCreator.shapesClicked.push([id]);
                ComplexShapeCreator.afterClickedOnShape();
            }
        }
        else if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.SEGMENT_ENDS)) {
            if (!(ComplexShapeCreator.segmentEndsChoosing.includes(id))) {
                ComplexShapeCreator.segmentEndsChoosing.push(id);

                let shapesToActivate: number[] = [];
                ComplexShapeCreator.segmentEndsChoosing.forEach(element => {
                    shapesToActivate.push(element);
                });

                ComplexShapeCreator.shapesClicked.forEach(element => {
                    if (element.length == 1) {
                        shapesToActivate.push(element[0]);
                    }
                    else {
                        shapesToActivate.push(element[0]);
                        shapesToActivate.push(element[1]);
                    }
                });
                Canvas.activateShapes(shapesToActivate);

                if (ComplexShapeCreator.segmentEndsChoosing.length == 2) {
                    let segment_id: [number, number] = [0, 0];
                    if (ComplexShapeCreator.segmentEndsChoosing[0] < ComplexShapeCreator.segmentEndsChoosing[1])
                        segment_id = [ComplexShapeCreator.segmentEndsChoosing[0], ComplexShapeCreator.segmentEndsChoosing[1]];
                    else
                        segment_id = [ComplexShapeCreator.segmentEndsChoosing[1], ComplexShapeCreator.segmentEndsChoosing[0]];

                    if (!ComplexShapeCreator.arrayIncludesId(ComplexShapeCreator.shapesClicked, segment_id)) {
                        ComplexShapeCreator.shapesClicked.push(segment_id);
                        ComplexShapeCreator.segmentEndsChoosing = [];
                        ComplexShapeCreator.afterClickedOnShape();
                    }
                    else {
                        // version 1
                        //ComplexShapeCreator.segmentEndsChoosing.pop();
                        //Canvas.activateShapes(ComplexShapeCreator.shapesClicked.concat(ComplexShapeCreator.segmentEndsChoosing));

                        // version 2
                        ComplexShapeCreator.segmentEndsChoosing = [];

                        shapesToActivate = [];
                        ComplexShapeCreator.shapesClicked.forEach(element => {
                            if (element.length == 1) {
                                shapesToActivate.push(element[0]);
                            }
                            else {
                                shapesToActivate.push(element[0]);
                                shapesToActivate.push(element[1]);
                            }
                        });
                        Canvas.activateShapes(shapesToActivate);
                    }
                }
            }
        }
    }

    /**
     * Check if event from {@link Canvas} - click on line - matches to the currenty required shape type to select.
     * If it matches process event.
     * @param id ID of clicked shape
     * @param x X coordinate of click
     * @param y Y coordinate of click 
     * @param next_id ID to set for new created shape
     */
    public static clickedOnLine(id: number, x: number, y: number, next_id: number): void {
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.SEGMENT)) {
            let endIDs = Canvas.getSegmentEnds(id);
            if (!ComplexShapeCreator.arrayIncludesId(ComplexShapeCreator.shapesClicked, endIDs)) {
                if (Canvas.getCurrentlyComplexShape() == ComplexShapeEnum.PERPENDICULAR_LINE || Canvas.getCurrentlyComplexShape() == ComplexShapeEnum.PARALLEL_LINE) {
                    let segment = Canvas.getShape(id);
                    let p = segment.getAttr('points');
                    if (Canvas.compareNumbers(p[0] - p[2], 0, 0.1)) {
                        Canvas.setBaseToPromptingLine([null, p[0]]);
                    }
                    else {
                        let a = (p[1] - p[3]) / (p[0] - p[2]);
                        let b = p[1] - a * p[0];
                        Canvas.setBaseToPromptingLine([a, b]);
                    }
                }

                if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.SEGMENT_ENDS)) {
                    ComplexShapeCreator.shapesClicked.push(endIDs);
                }
                else {
                    ComplexShapeCreator.shapesClicked.push([id]);
                }

                ComplexShapeCreator.afterClickedOnShape();
            }
        }
        else if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.NEW_POINT_CLICK_ON_SEGMENT)) {
            ComplexShapeCreator.shapesClicked.push([next_id]);
            CanvasManagerInterface.clickedOnSegment(id, x, y);
            Canvas.waitForShapeAppear(next_id);
            ComplexShapeCreator.afterClickedOnShape();
        }
    }

    /**
     * Check if event from {@link Canvas} - click on circle - matches to the currenty required shape type to select.
     * If it matches process event.
     * @param id ID of clicked shape
     * @param x X coordinate of click
     * @param y Y coordinate of click 
     * @param next_id ID to set for new created shape
     */
    public static clickedOnCircle(id: number, x: number, y: number, next_id: number): void {
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.CIRCLE)) {
            if (!ComplexShapeCreator.arrayIncludesId(ComplexShapeCreator.shapesClicked, [id])) {
                ComplexShapeCreator.shapesClicked.push([id]);
                ComplexShapeCreator.afterClickedOnShape();
            }
        }
        else if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.NEW_POINT_CLICK_ON_CIRCLE)) {
            ComplexShapeCreator.shapesClicked.push([next_id]);
            CanvasManagerInterface.clickedOnCircle(id, x, y);
            Canvas.waitForShapeAppear(next_id);
            ComplexShapeCreator.afterClickedOnShape();
        }
    }

    /**
     * Get IDs of selected shapes.
     * @returns array with IDs of selected shapes
     */
    public static getChosenShapes(): ([number] | [number, number])[] {
        return ComplexShapeCreator.shapesClicked;
    }

    /**
     * Initializing smooth and intuitive specific shape creation 
     * @param startUnitVertices array with  arrays representing shape vertices coordinates in unit size
     * @param fixedVertices array with numbers of shape vertices which are fixed
     * @param oxAxis array with numbers of shape vertices which form a segment parallel to the OX axis
     * @param availableTransformations array with numbers representing available transformations
     * @param parsedSidesOrder order of shape vertices in which shape vertices should be processed
     * @param confirmationFunctions array with functions which validate the correctness of the properties of the modified shape
     * @param dragRanges array with drag ranges which limit movement of moving point
     */
    public static fullConfigurePolygon(startUnitVertices: [number, number][], fixedVerticesIds: number[], fixedVertices: [number, number][], oxAxis: [number, number], availableTransformations: number[], parsedSidesOrder: number[][], confirmationFunctions: (((endVertices: [number, number][]) => boolean) | null)[], dragRanges: DragRangeType[], polygonType: DependeciesSetToSet): void {
        let calculatedUnit = ComplexShapeCreator.getUnit();
        let centerX = Canvas.getWidth() / 2;
        let centerY = Canvas.getHeight() / 2;
        for (let i = 0; i < startUnitVertices.length; i++) {
            startUnitVertices[i] = [centerX + startUnitVertices[i][0] * calculatedUnit, centerY + startUnitVertices[i][1] * calculatedUnit];
        }
        ComplexShapeCreator.startVertices = startUnitVertices.map((el) => { return el; });
        ComplexShapeCreator.currentPoints = startUnitVertices.map((el) => { return el; });
        ComplexShapeCreator.fixedVerticesIds = fixedVerticesIds.map((el) => { return el; });
        ComplexShapeCreator.fixedVertices = fixedVertices.map((el) => { return el; });
        ComplexShapeCreator.transformationsCounter = 0;
        ComplexShapeCreator.fixedVerticesStartPoint = 0;
        ComplexShapeCreator.oxAxis = oxAxis;
        ComplexShapeCreator.parsedSidesOrder = parsedSidesOrder;
        ComplexShapeCreator.availableTransformations = availableTransformations;
        ComplexShapeCreator.confirmationFunctions = confirmationFunctions;
        ComplexShapeCreator.dragRanges = dragRanges;
        ComplexShapeCreator.polygonType = polygonType;

        ComplexShapeCreator.calculateTransformations();

        ComplexShapeCreator.correctCurrentPoints();

        ComplexShapeCreator.availableTransformationType$.next(availableTransformations[0]);
        ComplexShapeCreator.displayComplexShapeCreator$.next(true);
        ComplexShapeCreator.displayPolygonMovement$.next(true);

        setTimeout(() => { Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints); }, 50);
    }

    /**
     * Calculating start transformations and setting moving point properties if applicable 
     */
    public static calculateTransformations(): void {
        if (ComplexShapeCreator.fixedVertices.length == 0) {
            Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
        }
        else if (ComplexShapeCreator.fixedVertices.length == 2) {
            let p = ComplexShapeCreator.parsedSidesOrder[ComplexShapeCreator.transformationsCounter];
            let fs = ComplexShapeCreator.fixedVertices;
            if (ComplexShapeCreator.fixedVerticesStartPoint == 1) {
                fs = [fs[1], fs[0]];
            }
            let ps = [ComplexShapeCreator.currentPoints[p[0]], ComplexShapeCreator.currentPoints[p[1]]];

            // calculating scale
            let fs_module = ComplexShapeCreator.calculateSideLength(fs as [[number, number], [number, number]]);
            let ps_module = ComplexShapeCreator.calculateSideLength(ps as [[number, number], [number, number]]);

            let k = fs_module / ps_module;
            ComplexShapeCreator.scalePoints(k, k);

            // calculating rotation
            ps = [ComplexShapeCreator.currentPoints[p[0]], ComplexShapeCreator.currentPoints[p[1]]];

            let theta1 = Math.atan2(fs[1][1] - fs[0][1], fs[1][0] - fs[0][0]);
            let theta2 = Math.atan2(ps[1][1] - ps[0][1], ps[1][0] - ps[0][0]);
            let theta = theta2 - theta1;
            if (Math.abs(theta) < 0.5) { // under ComplexShapeCreator threshold trigonometric functions become inaccurate - creating bigger difference
                ComplexShapeCreator.rotatePoints(1, false, true);
                ps = [ComplexShapeCreator.currentPoints[p[0]], ComplexShapeCreator.currentPoints[p[1]]];
                theta1 = Math.atan2(fs[1][1] - fs[0][1], fs[1][0] - fs[0][0]);
                theta2 = Math.atan2(ps[1][1] - ps[0][1], ps[1][0] - ps[0][0]);
                theta = theta2 - theta1;
            }
            ComplexShapeCreator.rotatePoints(theta, false, true);

            // calculating translation
            ps = [ComplexShapeCreator.currentPoints[p[0]], ComplexShapeCreator.currentPoints[p[1]]];
            let tx = fs[0][0] - ps[0][0];
            let ty = fs[0][1] - ps[0][1];
            ComplexShapeCreator.translatePoints(tx, ty, false);
        }
        else { } // unuse 

        if (ComplexShapeCreator.availableTransformations[ComplexShapeCreator.transformationsCounter] & AvailableTransformation.MOVING_POINT) {
            let p = ComplexShapeCreator.parsedSidesOrder[ComplexShapeCreator.transformationsCounter];
            let dragRange = ComplexShapeCreator.dragRanges[ComplexShapeCreator.transformationsCounter];

            let coordsChanger: (x: number, y: number) => [number, number];

            if (dragRange == DragRangeType.ISOSCELES_TRIANGLE_ARM) {
                coordsChanger = (x, y) => {
                    let r = ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[p[0]], ComplexShapeCreator.currentPoints[p[1]]]);
                    let new_coords = ComplexShapeCreator.getCoordsOnCircle(ComplexShapeCreator.currentPoints[p[3]][0], ComplexShapeCreator.currentPoints[p[3]][1], r, x, y);
                    ComplexShapeCreator.currentPoints[p[2]] = new_coords;
                    Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                    return new_coords;
                }

                let r = ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[p[0]], ComplexShapeCreator.currentPoints[p[1]]]);
                let x = ComplexShapeCreator.currentPoints[p[2]][0];
                let y = ComplexShapeCreator.currentPoints[p[2]][1];
                let new_coords = ComplexShapeCreator.getCoordsOnCircle(ComplexShapeCreator.currentPoints[p[3]][0], ComplexShapeCreator.currentPoints[p[3]][1], r, x, y);
                ComplexShapeCreator.currentPoints[p[2]] = new_coords;

                Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
            }
            else if (dragRange == DragRangeType.ISOSCELES_TRIANGLE_BASE) {
                let p1 = ComplexShapeCreator.currentPoints[p[0]];
                let p2 = ComplexShapeCreator.currentPoints[p[1]];
                if (Canvas.compareNumbers(p1[1] - p2[1], 0, 0.1)) {
                    // mid-perpendicular line to the triangle base: x = b
                    let b = (p1[0] + p2[0]) / 2;

                    coordsChanger = (x, y) => {
                        ComplexShapeCreator.currentPoints[p[2]] = [b, y];
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [b, y];
                    }
                }
                else {
                    // mid-perpendicular line to the triangle base: y = ax + b
                    let a = (p1[0] - p2[0]) / (p2[1] - p1[1]);
                    let midx = (p1[0] + p2[0]) / 2;
                    let midy = (p1[1] + p2[1]) / 2;
                    let b = midy - a * midx;

                    coordsChanger = (x, y) => {
                        let newX = (y - b) / a;
                        let newY = a * x + b;
                        let d1 = ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[p[2]], [x, newY]]);
                        let d2 = ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[p[2]], [newX, y]]);

                        if (d1 < d2) {
                            ComplexShapeCreator.currentPoints[p[2]] = [x, a * x + b];
                            Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
                            return [x, a * x + b];
                        }
                        else {
                            ComplexShapeCreator.currentPoints[p[2]] = [(y - b) / a, y];
                            Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
                            return [(y - b) / a, y];
                        }
                    }
                }
            }
            else if (dragRange == DragRangeType.RIGHT_TRIANGLE) {
                let e1 = ComplexShapeCreator.currentPoints[p[0]];
                let e2 = ComplexShapeCreator.currentPoints[p[1]];
                let r = 0.5 * ComplexShapeCreator.calculateSideLength([e1, e2]);
                let centerX = 0.5 * (e1[0] + e2[0]);
                let centerY = 0.5 * (e1[1] + e2[1]);

                coordsChanger = (x, y) => {
                    let new_coords = ComplexShapeCreator.getCoordsOnCircle(centerX, centerY, r, x, y);
                    ComplexShapeCreator.currentPoints[p[2]] = new_coords;
                    Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                    return new_coords;
                }

                let x = ComplexShapeCreator.currentPoints[p[2]][0];
                let y = ComplexShapeCreator.currentPoints[p[2]][1];
                let new_coords = ComplexShapeCreator.getCoordsOnCircle(centerX, centerY, r, x, y);
                ComplexShapeCreator.currentPoints[p[2]] = new_coords;

                Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
            }
            else if (dragRange == DragRangeType.RIGHT_TRIANGLE_CATHETUS) {
                let p1 = ComplexShapeCreator.currentPoints[p[0]];
                let p2 = ComplexShapeCreator.currentPoints[p[1]];
                if (Canvas.compareNumbers(p1[1] - p2[1], 0, 0.1)) {
                    // perpendicular line to the triangle cathetus: x = b
                    let b = p2[0];

                    coordsChanger = (x, y) => {
                        ComplexShapeCreator.currentPoints[p[2]] = [b, y];
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [b, y];
                    }
                }
                else {
                    // perpendicular line to the triangle cathetus: y = ax + b
                    let a = (p1[0] - p2[0]) / (p2[1] - p1[1]);
                    let b = p2[1] - a * p2[0];

                    coordsChanger = (x, y) => {
                        ComplexShapeCreator.currentPoints[p[2]] = [x, a * x + b];
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [x, a * x + b];
                    }
                }
            }
            else if (dragRange == DragRangeType.RECTANGLE) {
                let p1 = ComplexShapeCreator.currentPoints[p[0]];
                let p2 = ComplexShapeCreator.currentPoints[p[1]];
                if (Canvas.compareNumbers(p1[1] - p2[1], 0, 0.1)) {
                    // perpendicular line to the rectangle side: x = b
                    let b = p2[0];

                    coordsChanger = (x, y) => {
                        ComplexShapeCreator.currentPoints[p[2]] = [b, y];
                        ComplexShapeCreator.currentPoints[p[3]][1] = y;
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [b, y];
                    }
                }
                else {
                    // perpendicular line to the rectangle side: y = ax + b
                    let a = (p1[0] - p2[0]) / (p2[1] - p1[1]);
                    let b = p2[1] - a * p2[0];

                    coordsChanger = (x, y) => {
                        ComplexShapeCreator.currentPoints[p[2]] = [x, a * x + b];
                        let dx = x - p2[0];
                        let dy = a * x + b - p2[1];
                        ComplexShapeCreator.currentPoints[p[3]] = [p1[0] + dx, p1[1] + dy];
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [x, a * x + b];
                    }
                }
            }
            else if (dragRange == DragRangeType.PARALLELOGRAM) {
                let p1 = ComplexShapeCreator.currentPoints[p[0]];
                let p2 = ComplexShapeCreator.currentPoints[p[1]];

                coordsChanger = (x, y) => {
                    ComplexShapeCreator.currentPoints[p[2]] = [x, y];
                    let dx = x - p2[0];
                    let dy = y - p2[1];
                    ComplexShapeCreator.currentPoints[p[3]] = [p1[0] + dx, p1[1] + dy];
                    Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                    return [x, y];
                }
            }
            else if (dragRange == DragRangeType.RHOMBUS) {
                let p1 = ComplexShapeCreator.currentPoints[p[0]];
                let p2 = ComplexShapeCreator.currentPoints[p[1]];

                coordsChanger = (x, y) => {
                    let r = ComplexShapeCreator.calculateSideLength([p1, p2]);
                    let new_coords = ComplexShapeCreator.getCoordsOnCircle(p2[0], p2[1], r, x, y);
                    ComplexShapeCreator.currentPoints[p[2]] = new_coords;
                    let dx = new_coords[0] - p2[0];
                    let dy = new_coords[1] - p2[1];
                    ComplexShapeCreator.currentPoints[p[3]] = [p1[0] + dx, p1[1] + dy];
                    Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                    return new_coords;
                }
            }
            else if (dragRange == DragRangeType.KITE) {
                let p1 = ComplexShapeCreator.currentPoints[p[0]];
                let p2 = ComplexShapeCreator.currentPoints[p[1]];

                coordsChanger = (x, y) => {
                    let p3: [number, number] = [x, y]

                    if (ComplexShapeCreator.angleIsObtuse(p1, p2, p3)) {

                        let result: [number, number];

                        if (Canvas.compareNumbers(p1[0] - p3[0], 0, 0.1)) {
                            result = [2 * p1[0] - p2[0], p2[1]];
                        }
                        else if (Canvas.compareNumbers(p1[1] - p3[1], 0, 0.1)) {
                            result = [p2[0], 2 * p1[1] - p2[1]];
                        }
                        else {
                            let a1 = (p3[1] - p1[1]) / (p3[0] - p1[0]);
                            let b1 = p3[1] - a1 * p3[0];
                            let a2 = (p3[0] - p1[0]) / (p1[1] - p3[1]);
                            let b2 = p2[1] - a2 * p2[0];

                            let midx = (b2 - b1) / (a1 - a2);
                            let midy = a1 * midx + b1;


                            result = [2 * midx - p2[0], 2 * midy - p2[1]];
                        }

                        ComplexShapeCreator.currentPoints[p[2]] = p3;
                        ComplexShapeCreator.currentPoints[p[3]] = result;
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
                    }

                    return ComplexShapeCreator.currentPoints[p[2]];
                }
            }
            else if (dragRange == DragRangeType.RIGHT_TRAPEZOID_BASE) {
                let p1 = ComplexShapeCreator.currentPoints[p[0]];
                let p2 = ComplexShapeCreator.currentPoints[p[1]];
                let p4 = ComplexShapeCreator.currentPoints[p[3]];

                if (Canvas.compareNumbers(p1[0] - p2[0], 0, 0.1)) {
                    coordsChanger = (x, y) => {
                        ComplexShapeCreator.currentPoints[p[2]] = [x, y];
                        ComplexShapeCreator.currentPoints[p[3]][0] = x;
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [x, y];
                    }
                }
                else if (Canvas.compareNumbers(p1[1] - p2[1], 0, 0.1)) {
                    coordsChanger = (x, y) => {
                        ComplexShapeCreator.currentPoints[p[2]] = [x, y];
                        ComplexShapeCreator.currentPoints[p[3]][1] = y;
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [x, y];
                    }
                }
                else {
                    coordsChanger = (x, y) => {
                        let a1 = (p1[1] - p2[1]) / (p1[0] - p2[0]);
                        let b1 = y - a1 * x;
                        let a2 = (p2[0] - p1[0]) / (p1[1] - p2[1])
                        let b2 = p4[1] - a2 * p4[0];
                        let newX = (b2 - b1) / (a1 - a2);
                        let newY = a1 * newX + b1;
                        ComplexShapeCreator.currentPoints[p[2]] = [x, y];
                        ComplexShapeCreator.currentPoints[p[3]] = [newX, newY];
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [x, y];
                    }
                }
            }
            else if (dragRange == DragRangeType.ISOSCELES_TRAPEZOID_BASE) {
                let p1 = ComplexShapeCreator.currentPoints[p[0]];
                let p2 = ComplexShapeCreator.currentPoints[p[1]];
                let p4 = ComplexShapeCreator.currentPoints[p[3]];

                if (Canvas.compareNumbers(p1[0] - p2[0], 0, 0.1)) {
                    coordsChanger = (x, y) => {
                        ComplexShapeCreator.currentPoints[p[2]] = [x, y];
                        ComplexShapeCreator.currentPoints[p[3]] = [x, p1[1] - y + p2[1]];
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [x, y];
                    }
                }
                else if (Canvas.compareNumbers(p1[1] - p2[1], 0, 0.1)) {
                    coordsChanger = (x, y) => {
                        ComplexShapeCreator.currentPoints[p[2]] = [x, y];
                        ComplexShapeCreator.currentPoints[p[3]] = [p1[0] - x + p2[0], y];
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [x, y];
                    }
                }
                else {
                    coordsChanger = (x, y) => {
                        // znana podstawa
                        let a1 = (p2[1] - p1[1]) / (p2[0] - p1[0]);

                        // druga podstawa
                        let a2 = a1;
                        let b2 = y - a2 * x;

                        // prostopadla do znanej podstawy przez jej srodek
                        let midX = (p1[0] + p2[0]) / 2;
                        let midY = (p1[1] + p2[1]) / 2;
                        let a3 = (p2[0] - p1[0]) / (p1[1] - p2[1]);
                        let b3 = midY - a3 * midX;

                        let midX2 = (b2 - b3) / (a3 - a2);
                        let midY2 = a3 * midX2 + b3;

                        ComplexShapeCreator.currentPoints[p[2]] = [x, y];
                        ComplexShapeCreator.currentPoints[p[3]] = [2 * midX2 - x, 2 * midY2 - y];
                        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                        return [x, y];
                    }
                }
            }
            else {
                coordsChanger = (x, y) => {
                    ComplexShapeCreator.currentPoints[p[2]] = [x, y];
                    Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);

                    return [x, y];
                }
            }

            // creating instance of moving point
            let mp = ComplexShapeCreator.currentPoints[p[2]];
            Canvas.createMovingPromptingPoint(mp[0], mp[1], coordsChanger);
        }

        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
    }

    public static allPointOnCanvas(): boolean {
        for (let i = 0; i < ComplexShapeCreator.currentPoints.length; i++) {
            let element = ComplexShapeCreator.currentPoints[i];
            if (element[0] <= 0 || element[1] <= 0 || element[0] >= Canvas.getWidth() || element[1] >= Canvas.getHeight()) {
                return false;
            }
        }

        return true;
    }


    public static correctCurrentPoints() {
        //while(!ComplexShapeCreator.allPointOnCanvas()) {
        //    console.log('JAKIS PUNKT JEST POZA CANVA');
        //}
    }

    /**
     * Cancel configuring shape
     */
    public static cancelConfiguring(): void {
        ComplexShapeCreator.displayComplexShapeCreator$.next(false);
        ComplexShapeCreator.displayPolygonMovement$.next(false);
        ComplexShapeCreator.displayMovingPointAlert$.next(false);
        ComplexShapeCreator.movingPointAlert$.next("");
        ComplexShapeCreator.currentPoints = [];
        Canvas.clearBatchLayer();
        Canvas.deleteMovingPromptingPoint();
    }

    /**
    * Confirmation of the creation of a new shape. 
    * If the current function from {@link ComplexShapeCreator.confirmationFunctions} returns true, a new shape is created
    */
    public static confirmPolygonCreating(): void {
        let confirmationFunction = ComplexShapeCreator.confirmationFunctions[ComplexShapeCreator.transformationsCounter];
        if (confirmationFunction) {
            if (!confirmationFunction.call(null, ComplexShapeCreator.currentPoints)) {
                ComplexShapeCreator.displayMovingPointAlert$.next(true);
                ComplexShapeCreator.movingPointAlert$.next("ComplexShapeCreator IS NOT THE CHOSEN SHAPE!");
                return;
            }
        }

        Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.POINT);

        let pointIds: number[] = [];

        let n = ComplexShapeCreator.currentPoints.length;
        for (let i = 0; i < n; i++) {
            pointIds.push(CanvasManagerInterface.clickedOnCanvas(ComplexShapeCreator.currentPoints[i][0], ComplexShapeCreator.currentPoints[i][1]));
        }

        Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.SEGMENT);

        let side1, side2, side3, maxLen, p1, p2, p3;

        switch (ComplexShapeCreator.polygonType) {
            case DependeciesSetToSet.ISOSCELES_ACUTE_TRIANGLE:
                for (let i = 0; i < 3; i++) {
                    if (Canvas.compareNumbers(
                        ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[i], ComplexShapeCreator.currentPoints[(i + 1) % 3]]),
                        ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[i], ComplexShapeCreator.currentPoints[(i + 2) % 3]]),
                        1.0)) {
                        let p1 = pointIds[i];
                        let p2 = pointIds[(i + 1) % 3];
                        let p3 = pointIds[(i + 2) % 3];
                        pointIds = [p3, p2, p1]
                        break;
                    }
                }

                for (let i = 0; i < 3; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 3]);
                }

                // [base vertex 1, base vertex 2, top vertex]
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.ISOSCELES_ACUTE_TRIANGLE)
                break;
            case DependeciesSetToSet.EQUILATERAL_TRIANGLE:
                for (let i = 0; i < 3; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 3]);
                }

                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.EQUILATERAL_TRIANGLE)
                break;
            case DependeciesSetToSet.SCALENE_RIGHT_TRIANGLE:
                side1 = ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[0], ComplexShapeCreator.currentPoints[1]]);
                side2 = ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[1], ComplexShapeCreator.currentPoints[2]]);
                side3 = ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[2], ComplexShapeCreator.currentPoints[0]]);
                maxLen = Math.max(side1, side2, side3);

                p1 = pointIds[0];
                p2 = pointIds[1];
                p3 = pointIds[2];

                if (maxLen == side1) {
                    pointIds = [p3, p2, p1];
                }
                else if (maxLen == side2) {
                    pointIds = [p1, p2, p3];
                }
                else {
                    pointIds = [p2, p3, p1];
                }

                for (let i = 0; i < 3; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 3]);
                }

                // [right angle vertex, hypotenuse vertex 1, hypotenuse vertex 2]
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.SCALENE_RIGHT_TRIANGLE)
                break;
            case DependeciesSetToSet.ISOSCELES_RIGHT_TRIANGLE:
                side1 = ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[0], ComplexShapeCreator.currentPoints[1]]);
                side2 = ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[1], ComplexShapeCreator.currentPoints[2]]);
                side3 = ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[2], ComplexShapeCreator.currentPoints[0]]);
                maxLen = Math.max(side1, side2, side3);

                p1 = pointIds[0];
                p2 = pointIds[1];
                p3 = pointIds[2];

                if (maxLen == side1) {
                    pointIds = [p3, p2, p1];
                }
                else if (maxLen == side2) {
                    pointIds = [p1, p2, p3];
                }
                else {
                    pointIds = [p2, p3, p1];
                }

                for (let i = 0; i < 3; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 3]);
                }

                // [right angle vertex, hypotenuse vertex 1, hypotenuse vertex 2]
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.ISOSCELES_RIGHT_TRIANGLE)
                break;
            case DependeciesSetToSet.OBTUSE_ISOSCELES_TRIANGLE:
                for (let i = 0; i < 3; i++) {
                    if (Canvas.compareNumbers(
                        ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[i], ComplexShapeCreator.currentPoints[(i + 1) % 3]]),
                        ComplexShapeCreator.calculateSideLength([ComplexShapeCreator.currentPoints[i], ComplexShapeCreator.currentPoints[(i + 2) % 3]]),
                        1.0)) {
                        let p1 = pointIds[i];
                        let p2 = pointIds[(i + 1) % 3];
                        let p3 = pointIds[(i + 2) % 3];
                        pointIds = [p3, p2, p1]
                        break;
                    }
                }

                for (let i = 0; i < 3; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 3]);
                }

                // [base vertex 1, base vertex 2, top vertex]
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.OBTUSE_ISOSCELES_TRIANGLE)
                break;
            case DependeciesSetToSet.SQUARE:
                for (let i = 0; i < 4; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 4]);
                }

                // points sorted clockwise or counter clockwise
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.SQUARE)
                break;
            case DependeciesSetToSet.RECTANGLE:
                for (let i = 0; i < 4; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 4]);
                }

                // points sorted clockwise or counter clockwise
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.RECTANGLE)
                break;
            case DependeciesSetToSet.REGULAR_POLYGON:
                for (let i = 0; i < pointIds.length; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % pointIds.length]);
                }

                // points sorted clockwise or counter clockwise
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.REGULAR_POLYGON)
                break;
            case DependeciesSetToSet.PARALLELOGRAM:
                for (let i = 0; i < 4; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 4]);
                }

                // points sorted clockwise or counter clockwise
                // pointIds[0] with pointIds[2] create axis of symmetry
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.PARALLELOGRAM)
                break;
            case DependeciesSetToSet.KITE:
                for (let i = 0; i < 4; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 4]);
                }

                // points sorted clockwise or counter clockwise
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.KITE)
                break;
            case DependeciesSetToSet.RHOMBUS:
                for (let i = 0; i < 4; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 4]);
                }

                // points sorted clockwise or counter clockwise
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.RHOMBUS)
                break;
            case DependeciesSetToSet.SCALENE_TRAPEZOID:
                for (let i = 0; i < 4; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 4]);
                }

                // points sorted clockwise or counter clockwise
                // pointIds[0] with pointIds[1] and pointIds[2] with pointIds[3] are bases
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.SCALENE_TRAPEZOID)
                break;
            case DependeciesSetToSet.ISOSCELES_TRAPEZOID:
                for (let i = 0; i < 4; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 4]);
                }

                // points sorted clockwise or counter clockwise
                // pointIds[0] with pointIds[1] and pointIds[2] with pointIds[3] are bases
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.ISOSCELES_TRAPEZOID)
                break;
            case DependeciesSetToSet.RIGHT_TRAPEZOID:
                for (let i = 0; i < 4; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % 4]);
                }

                // pointIds[0] with pointIds[1] and pointIds[2] with pointIds[3] are bases
                // points sorted clockwise or counter clockwise
                CanvasManagerInterface.setPolygonType(pointIds, PolygonTypeEnum.RIGHT_TRAPEZOID)
                break;
            default:
                for (let i = 0; i < n; i++) {
                    CanvasManagerInterface.clickedOnPoint(pointIds[i]);
                    CanvasManagerInterface.clickedOnPoint(pointIds[(i + 1) % n]);
                }
                break;
        }

        ComplexShapeCreator.cancelConfiguring();
        Canvas.setCurrentyCreatedShape(ShapeToCreateEnum.NONE);
    }


    /**
     * Changing side of polygon which is fixed. Updating available transformations
     */
    public static changeSide(): void {
        Canvas.deleteMovingPromptingPoint();
        ComplexShapeCreator.transformationsCounter = (ComplexShapeCreator.transformationsCounter + 1) % ComplexShapeCreator.availableTransformations.length;
        ComplexShapeCreator.availableTransformationType$.next(ComplexShapeCreator.availableTransformations[ComplexShapeCreator.transformationsCounter]);
        ComplexShapeCreator.currentPoints = ComplexShapeCreator.startVertices.map((el) => { return el; });
        ComplexShapeCreator.displayMovingPointAlert$.next(false);
        ComplexShapeCreator.movingPointAlert$.next("");
        ComplexShapeCreator.calculateTransformations();
    }

    /**
     * Reflection relative to the line drawn by the {@link ComplexShapeCreator.fixedVertices} of {@link ComplexShapeCreator.currentPoints}
     */
    public static mirrorImageX(): void {
        let fs = ComplexShapeCreator.fixedVertices;
        if (Canvas.compareNumbers(fs[0][0] - fs[1][0], 0, 0.1)) {
            for (let i = 0; i < ComplexShapeCreator.currentPoints.length; i++) {
                let p = ComplexShapeCreator.currentPoints[i];
                let b = fs[0][0];
                if (!Canvas.compareNumbers(b - p[0], 0, 0.1)) {
                    ComplexShapeCreator.currentPoints[i] = [2 * b - p[0], p[1]];
                }
            }
        }
        else {
            let a = (fs[0][1] - fs[1][1]) / (fs[0][0] - fs[1][0]);
            let b = fs[0][1] - a * fs[0][0];

            for (let i = 0; i < ComplexShapeCreator.currentPoints.length; i++) {
                let p = ComplexShapeCreator.currentPoints[i];
                let x = ((1 - a * a) / (a * a + 1)) * p[0] + (2 * a / ((a * a + 1))) * (p[1] - b);
                let y = ((a * a - 1) / (a * a + 1)) * (p[1] - b) + (2 * a * p[0]) / (a * a + 1) + b;
                ComplexShapeCreator.currentPoints[i] = [x, y];
            }
        }
        Canvas.deleteMovingPromptingPoint();
        ComplexShapeCreator.calculateTransformations();
        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
    }

    /**
     * Reflection relative to the perpendicular line to line drawn by the {@link ComplexShapeCreator.fixedVertices} of {@link ComplexShapeCreator.currentPoints}
     */
    public static mirrorImageY(): void {
        Canvas.deleteMovingPromptingPoint();

        ComplexShapeCreator.fixedVerticesStartPoint = (ComplexShapeCreator.fixedVerticesStartPoint + 1) % 2;
        ComplexShapeCreator.calculateTransformations();
        ComplexShapeCreator.mirrorImageX();

        Canvas.deleteMovingPromptingPoint();

        ComplexShapeCreator.calculateTransformations();
    }

    /**
     * Translating of {@link ComplexShapeCreator.currentPoints} by vector [x, y]
     * @param x first vector component
     * @param y second vector component
     * @param in_units true if values are in units, false otherwise
     */
    public static translatePoints(x: number, y: number, in_units: boolean): void {
        if (in_units) {
            let calculatedUnit = ComplexShapeCreator.getUnit();
            x *= calculatedUnit;
            y *= calculatedUnit;
        }

        for (let i = 0; i < ComplexShapeCreator.currentPoints.length; i++) {
            let p = ComplexShapeCreator.currentPoints[i];
            ComplexShapeCreator.currentPoints[i] = [p[0] + x, p[1] + y];
        }

        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
    }

    /**
     * Rotating {@link ComplexShapeCreator.currentPoints} by angle
     * @param angle value of angle
     * @param clockwise true if clockwise rotation, false if counter-clockwise rotation
     * @param radians true if angle value is in radians, false if angle value is in degrees
     */
    public static rotatePoints(angle: number, clockwise: boolean, radians: boolean): void {
        // p.x' = cos(angle) * (p.x - cx) - sin(angle) * (p.y - cy) + cx
        // p.y' = sin(angle) * (p.x - cx) + cos(angle) * (p.y - cy) + cy

        // counter-clockwise => sin(-15deg) = -sin(15deg) and cos(-15deg) = cos(15deg)

        let sinAngle, cosAngle;
        if (radians) {
            sinAngle = Math.sin(angle);
            cosAngle = Math.cos(angle);
        }
        else {
            sinAngle = Math.sin(angle * Math.PI / 180.0);
            cosAngle = Math.cos(angle * Math.PI / 180.0);
        }
        if (!clockwise) {
            sinAngle *= -1;
        }

        let centroid = ComplexShapeCreator.calculateCentroid(ComplexShapeCreator.currentPoints);
        for (let i = 0; i < ComplexShapeCreator.currentPoints.length; i++) {
            let p = ComplexShapeCreator.currentPoints[i];

            let t1 = cosAngle * (p[0] - centroid[0]);
            let t2 = sinAngle * (p[1] - centroid[1]);
            let t3 = sinAngle * (p[0] - centroid[0]);
            let t4 = cosAngle * (p[1] - centroid[1]);

            ComplexShapeCreator.currentPoints[i] = [centroid[0] + t1 - t2, centroid[1] + t3 + t4];
        }
        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
    }

    /**
     * Scaling {@link ComplexShapeCreator.currentPoints} with respect to lines parallel and perpendicular to {@link ComplexShapeCreator.oxAxis}
     * @param kx scaling factor with respect to the parallel line 
     * @param ky scaling factor with respect to the perpendicular line 
     */
    public static scalePoints(kx: number, ky: number): void {
        let s = ComplexShapeCreator.currentPoints;
        let oxAxis = ComplexShapeCreator.oxAxis;
        let v = [s[oxAxis[1]][0] - s[oxAxis[0]][0], s[oxAxis[1]][1] - s[oxAxis[0]][1]];
        let v_module = ComplexShapeCreator.calculateSideLength([s[0], s[1]]);
        let nx = -v[1] / v_module;
        let ny = v[0] / v_module;

        let centroid = ComplexShapeCreator.calculateCentroid(ComplexShapeCreator.currentPoints);

        // direction perpendicular to oxAxis
        for (let i = 0; i < ComplexShapeCreator.currentPoints.length; i++) {
            let p = ComplexShapeCreator.currentPoints[i];
            let newX = (1 + (ky - 1) * nx * nx) * (p[0] - centroid[0]) + ((ky - 1) * nx * ny) * (p[1] - centroid[1]) + centroid[0];
            let newY = ((ky - 1) * nx * ny) * (p[0] - centroid[0]) + (1 + (ky - 1) * ny * ny) * (p[1] - centroid[1]) + centroid[1];

            ComplexShapeCreator.currentPoints[i] = [newX, newY];
        }

        nx = v[0] / v_module;
        ny = v[1] / v_module;

        // direction parallel to oxAxis
        for (let i = 0; i < ComplexShapeCreator.currentPoints.length; i++) {
            let p = ComplexShapeCreator.currentPoints[i];
            let newX = (1 + (kx - 1) * nx * nx) * (p[0] - centroid[0]) + ((kx - 1) * nx * ny) * (p[1] - centroid[1]) + centroid[0];
            let newY = ((kx - 1) * nx * ny) * (p[0] - centroid[0]) + (1 + (kx - 1) * ny * ny) * (p[1] - centroid[1]) + centroid[1];

            ComplexShapeCreator.currentPoints[i] = [newX, newY];
        }

        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
    }

    /**
     * Inversion of {@link ComplexShapeCreator.currentPoints} with respect to the mid perpendicular of segment created by 2 first points of {@link ComplexShapeCreator.currentPoints}
     */
    public static reverse(): void {
        let p0 = ComplexShapeCreator.currentPoints[0];
        let p1 = ComplexShapeCreator.currentPoints[1];

        let theta = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);

        if (Math.abs(theta) < 0.5) { // under ComplexShapeCreator threshold trigonometric functions become inaccurate - creating bigger difference
            ComplexShapeCreator.rotatePoints(1, false, true);

            p0 = ComplexShapeCreator.currentPoints[0];
            p1 = ComplexShapeCreator.currentPoints[1];

            theta = Math.atan2(p1[1] - p0[1], p1[0] - p0[0])
        }
        ComplexShapeCreator.rotatePoints(theta, false, true);

        p1 = ComplexShapeCreator.currentPoints[1];
        let p2 = ComplexShapeCreator.currentPoints[2];
        let p3 = ComplexShapeCreator.currentPoints[3];

        let dx = p2[0] - p1[0];
        let dy = p2[1] - p3[1];

        ComplexShapeCreator.currentPoints[0][0] += dx;
        ComplexShapeCreator.currentPoints[1][0] += dx;
        ComplexShapeCreator.currentPoints[2][0] -= dx;
        ComplexShapeCreator.currentPoints[3][0] -= dx;

        ComplexShapeCreator.currentPoints[0][1] -= dy;
        ComplexShapeCreator.currentPoints[1][1] -= dy;
        ComplexShapeCreator.currentPoints[2][1] += dy;
        ComplexShapeCreator.currentPoints[3][1] += dy;

        ComplexShapeCreator.rotatePoints(theta, true, true);
    }

    /**
     * Setting coordinates of moving point
     * @param x X coordinate to set
     * @param y Y coordinate to set
     */
    public static setMovingPointCoordinate(x: number, y: number): void {
        ComplexShapeCreator.currentPoints[ComplexShapeCreator.parsedSidesOrder[ComplexShapeCreator.transformationsCounter][2]] = [x, y];
        Canvas.drawPromptingPolygon(ComplexShapeCreator.currentPoints);
    }

    /**
   * Converting point coordinates from normal values to unit values using in {@link ComplexShapeCreator.fullConfigurePolygon}
   * @param point array with point coordinates
   * @returns array with converted point coordinates to unit form
   */
    public static toUnit(point: [number, number]): [number, number] {
        let cx = Canvas.getWidth() / 2;
        let cy = Canvas.getHeight() / 2;
        let unit = ComplexShapeCreator.getUnit();

        return [(point[0] - cx) / unit, (point[1] - cy) / unit];
    }

    /**
     * Calculating length of side
     * @param ends array with arrays representing point coordinates
     * @returns length of side
     */
    public static calculateSideLength(ends: [[number, number], [number, number]]): number {
        let dx = ends[0][0] - ends[1][0];
        let dy = ends[0][1] - ends[1][1];

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Finding the point on the circle closest to a given point 
     * @param p X coordinate of circle center
     * @param q Y coordinate of circle center
     * @param r circle radius length
     * @param x X coordinate of given point
     * @param y Y coordinate of given point
     * @returns array with result point coordnates 
     */
    public static getCoordsOnCircle(p: number, q: number, r: number, x: number, y: number): [number, number] {
        if (Canvas.compareNumbers(x - p, 0, 0.1)) {
            if (y > q) {
                return [p, q + r];
            }
            else {
                [p, q - r];
            }
        }
        else {
            let a = (y - q) / (x - p);
            let b = y - a * x;

            if (Canvas.compareNumbers(a, 0, 0.01)) { a = 0; }
            if (Canvas.compareNumbers(b, 0, 0.01)) { b = 0; }

            let A = 1 + a * a;
            let B = -2 * p + 2 * a * b - 2 * a * q;
            let C = p * p + b * b + q * q - r * r - 2 * b * q;

            let delta = B * B - 4 * A * C;

            if (Canvas.compareNumbers(delta, 0, 0.01)) { delta = 0; }

            if (x < p) {
                let x1 = (-B - Math.sqrt(delta)) / (2 * A);
                let y1 = a * x1 + b;
                return [x1, y1];
            }
            else {
                let x2 = (-B + Math.sqrt(delta)) / (2 * A);
                let y2 = a * x2 + b;
                return [x2, y2];
            }
        }

        return [x, y];
    }

    /**
     * Checking if angle is obtuse
     * @param p1 array with coordinates of first point
     * @param p2 array with coordinates of second point - vertex
     * @param p3 array with coordinates of third point
     * @returns true if angle is obtuse, false otherwise
     */
    public static angleIsObtuse(p1: [number, number], p2: [number, number], p3: [number, number]): boolean {
        let s1 = ComplexShapeCreator.calculateSideLength([p1, p2]);
        let s2 = ComplexShapeCreator.calculateSideLength([p2, p3]);
        let s3 = ComplexShapeCreator.calculateSideLength([p3, p1]);
        let sidesto2 = [s1 * s1, s2 * s2, s3 * s3];

        return (sidesto2[0] + sidesto2[1]) < sidesto2[2];
    }

    /**
     * Checking if triangle is acute triangle
     * @param vertices array with arrays representing triangle vertices
     * @returns true if triangle is acute, false otherwise
     */
    public static triangleIsAcute(vertices: [number, number][]): boolean {
        let s1 = ComplexShapeCreator.calculateSideLength([vertices[0], vertices[1]]);
        let s2 = ComplexShapeCreator.calculateSideLength([vertices[1], vertices[2]]);
        let s3 = ComplexShapeCreator.calculateSideLength([vertices[2], vertices[0]]);
        let sidesto2 = [s1 * s1, s2 * s2, s3 * s3];
        for (let i = 0; i < 3; i++) {
            if (sidesto2[i] + sidesto2[(i + 1) % 3] < sidesto2[(i + 2) % 3])
                return false;
        }
        return true;
    }

    /**
     * Checking if triangle is obtuse angle
     * @param vertices array with arrays representing triangle vertices
     * @returns true if triangle is obtuse, false otherwise
     */
    public static triangleIsObtuse(vertices: [number, number][]): boolean {
        let s1 = ComplexShapeCreator.calculateSideLength([vertices[0], vertices[1]]);
        let s2 = ComplexShapeCreator.calculateSideLength([vertices[1], vertices[2]]);
        let s3 = ComplexShapeCreator.calculateSideLength([vertices[2], vertices[0]]);
        let sidesto2 = [s1 * s1, s2 * s2, s3 * s3];
        for (let i = 0; i < 3; i++) {
            if (sidesto2[i] + sidesto2[(i + 1) % 3] < sidesto2[(i + 2) % 3])
                return true;
        }

        return false;
    }

    /**
     * Process data after selection new shape.
     */
    private static afterClickedOnShape(): void {
        ComplexShapeCreator.counter += 1;

        if (ComplexShapeCreator.counter == ComplexShapeCreator.shapesToClick.length) {
            ComplexShapeCreator.cancelChoosing();
            ComplexShapeCreator.functionToDo.apply(null);
        }
        else {
            let shapesToActivate: number[] = [];
            ComplexShapeCreator.segmentEndsChoosing.forEach(element => {
                shapesToActivate.push(element);
            });

            ComplexShapeCreator.shapesClicked.forEach(element => {
                if (element.length == 1) {
                    shapesToActivate.push(element[0]);
                }
                else {
                    shapesToActivate.push(element[0]);
                    shapesToActivate.push(element[1]);
                }
            });
            Canvas.activateShapes(shapesToActivate);

            ComplexShapeCreator.instructionToSet$.next(ComplexShapeCreator.getInstructions());
        }
    }

    /**
     * Get text of instructions to display on dashboard.
     * @returns text of instructions to display on dashboard
     */
    private static getInstructions(): string {
        let instructions = 0;
        let result = "";
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.EXISTING_POINT)) {
            result += "choose point";
            instructions += 1;
        }
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.NEW_POINT_CLICK_ON_CANVAS)) {
            if (instructions > 0)
                result += " or ";
            result += "click on canvas";
            instructions += 1;
        }
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.NEW_POINT_CLICK_ON_SEGMENT)) {
            if (instructions > 0)
                result += " or ";
            result += "click on segment";
            instructions += 1;
        }
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.NEW_POINT_CLICK_ON_CIRCLE)) {
            if (instructions > 0)
                result += " or ";
            result += "click on circle";
            instructions += 1;
        }
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.SEGMENT)) {
            if (instructions > 0)
                result += " or ";
            result += "choose segment";
            instructions += 1;
        }
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.SEGMENT_ENDS)) {
            if (instructions > 0)
                result += " or ";
            result += "choose segment ends";
            instructions += 1;
        }
        if (ComplexShapeCreator.shapesToClick[ComplexShapeCreator.counter].includes(ShapeToSelect.CIRCLE)) {
            if (instructions > 0)
                result += " or ";
            result += "choose circle";
            instructions += 1;
        }

        return result;
    }

    /**
     * Calculating centroid of polygon
     * @param points array with 2-element arrays representing polygon vertices
     * @returns 2-element array with X and Y coordinate of centroid
     */
    private static calculateCentroid(points: [number, number][]): [number, number] {
        let centroidX = 0, centroidY = 0, signedArea = 0;

        for (let i = 0; i < points.length; i++) {
            let x0 = points[i][0];
            let y0 = points[i][1];
            let x1 = points[(i + 1) % points.length][0];
            let y1 = points[(i + 1) % points.length][1];

            let A = (x0 * y1) - (x1 * y0);
            signedArea += A;

            centroidX += (x0 + x1) * A;
            centroidY += (y0 + y1) * A;
        }

        signedArea *= 0.5;
        centroidX = (centroidX) / (6 * signedArea);
        centroidY = (centroidY) / (6 * signedArea);

        return [centroidX, centroidY];
    }
}

