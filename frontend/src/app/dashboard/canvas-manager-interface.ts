import { Module } from '../canvasManager';

export enum ShapeToCreateEnum {
    NONE,
    POINT,
    SEGMENT,
    LINE,
    SEMILINE,
    CIRCLE,
    COMPLEX_SHAPE
}

function ShapeToCreateEnumToRaw(key: ShapeToCreateEnum) {
    switch (key) {
        case ShapeToCreateEnum.NONE:
            return Module.ShapeToCreate.NONE;
        case ShapeToCreateEnum.POINT:
            return Module.ShapeToCreate.POINT;
        case ShapeToCreateEnum.SEGMENT:
            return Module.ShapeToCreate.SEGMENT;
        case ShapeToCreateEnum.LINE:
            return Module.ShapeToCreate.LINE;
        case ShapeToCreateEnum.SEMILINE:
            return Module.ShapeToCreate.SEMILINE;
        case ShapeToCreateEnum.CIRCLE:
            return Module.ShapeToCreate.CIRCLE;
        case ShapeToCreateEnum.COMPLEX_SHAPE:
            return Module.ShapeToCreate.COMPLEX_SHAPE;
        default:
            break;
    }
}

export enum AngleTypeEnum {
    UNKNOWN,
    CONVEX,
    CONCAVE
}

function AngleTypeEnumToRaw(key: AngleTypeEnum) {
    switch (key) {
        case AngleTypeEnum.UNKNOWN:
            return Module.AngleType.UNKNOWN;
        case AngleTypeEnum.CONVEX:
            return Module.AngleType.CONVEX;
        case AngleTypeEnum.CONCAVE:
            return Module.AngleType.CONCAVE;
        default:
            break;
    }
}

export enum PolygonTypeEnum {
    UNKNOWN,
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

function PolygonTypeEnumToRaw(key: PolygonTypeEnum) {
    switch (key) {
        case PolygonTypeEnum.UNKNOWN:
            return Module.PolygonType.UNKNOWN;
        case PolygonTypeEnum.ISOSCELES_ACUTE_TRIANGLE:
            return Module.PolygonType.ISOSCELES_ACUTE_TRIANGLE;
        case PolygonTypeEnum.EQUILATERAL_TRIANGLE:
            return Module.PolygonType.EQUILATERAL_TRIANGLE;
        case PolygonTypeEnum.SCALENE_RIGHT_TRIANGLE:
            return Module.PolygonType.SCALENE_RIGHT_TRIANGLE;
        case PolygonTypeEnum.ISOSCELES_RIGHT_TRIANGLE:
            return Module.PolygonType.ISOSCELES_RIGHT_TRIANGLE;
        case PolygonTypeEnum.OBTUSE_ISOSCELES_TRIANGLE:
            return Module.PolygonType.OBTUSE_ISOSCELES_TRIANGLE;
        case PolygonTypeEnum.SQUARE:
            return Module.PolygonType.SQUARE;
        case PolygonTypeEnum.RECTANGLE:
            return Module.PolygonType.RECTANGLE;
        case PolygonTypeEnum.REGULAR_POLYGON:
            return Module.PolygonType.REGULAR_POLYGON;
        case PolygonTypeEnum.PARALLELOGRAM:
            return Module.PolygonType.PARALLELOGRAM;
        case PolygonTypeEnum.KITE:
            return Module.PolygonType.KITE;
        case PolygonTypeEnum.RHOMBUS:
            return Module.PolygonType.RHOMBUS;
        case PolygonTypeEnum.SCALENE_TRAPEZOID:
            return Module.PolygonType.SCALENE_TRAPEZOID;
        case PolygonTypeEnum.ISOSCELES_TRAPEZOID:
            return Module.PolygonType.ISOSCELES_TRAPEZOID;
        case PolygonTypeEnum.RIGHT_TRAPEZOID:
            return Module.PolygonType.RIGHT_TRAPEZOID;
        default:
            break;
    }
}

export class CanvasManagerInterface {
    private static manager: any;

    private static lockUI: () => void;
    private static unlockUI: () => void;

    public static init(width: number, height: number, offset: number,
        drawPoint: (id: number, x: number, y: number) => void,
        drawSegment: (id: number, x1: number, y1: number, x2: number, y2: number) => void,
        drawCircle: (id: number, x: number, y: number, radius: number) => void,
        deleteShape: (id: number) => void,
        setPromptingShapeStartPoint: (set: boolean, x: number, y: number) => void,
        lockInterface: () => void,
        unlockInterface: () => void,
        alert: (id: number, content: string) => void) {

        CanvasManagerInterface.lockUI = lockInterface;
        CanvasManagerInterface.unlockUI = unlockInterface;

        const alertParser = (type: number, contentAsInteger: number) => { alert(type, Module.UTF8ToString(contentAsInteger)); }

        CanvasManagerInterface.lockUI();

        //Module.onRuntimeInitialized = async function () {
        const referenceToDrawPointFunction = Module.addFunction(drawPoint, 'vidd');
        const referenceToDrawSegmentFunction = Module.addFunction(drawSegment, 'vidddd');
        const referenceToDrawCircleFunction = Module.addFunction(drawCircle, 'viddd');
        const referenceToDeleteShapeFunction = Module.addFunction(deleteShape, 'vi');
        const referenceToSetPromptingShapeStartPointFunction = Module.addFunction(setPromptingShapeStartPoint, 'vidd');
        const referenceToUnlockInterfaceFunction = Module.addFunction(unlockInterface, 'v');
        const referenceToAlertFunction = Module.addFunction(alertParser, 'vii');

        CanvasManagerInterface.manager = new Module.CanvasManager(width, height, offset,
            referenceToDrawPointFunction, referenceToDrawSegmentFunction, referenceToDrawCircleFunction,
            referenceToDeleteShapeFunction, referenceToSetPromptingShapeStartPointFunction,
            referenceToUnlockInterfaceFunction, referenceToAlertFunction);

        CanvasManagerInterface.unlockUI();  
        //}
    };

    public static clearCanvas() {
        CanvasManagerInterface.lockUI();
        CanvasManagerInterface.manager.clearCanvas();
    }

    public static setCurrentlyCreatedShape(shapeToCreate: ShapeToCreateEnum) {
        CanvasManagerInterface.manager.setCurrentlyCreatedShape(ShapeToCreateEnumToRaw(shapeToCreate));
    }

    public static clickedOnCanvas(x: number, y: number): number {
        CanvasManagerInterface.lockUI();
        return CanvasManagerInterface.manager.clickedOnCanvas(x, y);
    }

    public static clickedOnPoint(id: number): number {
        CanvasManagerInterface.lockUI();
        return CanvasManagerInterface.manager.clickedOnPoint(id);
    }

    public static clickedOnSegment(id: number, x: number, y: number): number {
        CanvasManagerInterface.lockUI();
        return CanvasManagerInterface.manager.clickedOnSegment(id, x, y);
    }

    public static clickedOnCircle(id: number, x: number, y: number): number {
        CanvasManagerInterface.lockUI();
        return CanvasManagerInterface.manager.clickedOnCircle(id, x, y);
    }

    public static setPerpendicularityDependency(line1Id: number, line2Id: number) {
        CanvasManagerInterface.manager.setPerpendicularityDependency(line1Id, line2Id);
    }

    public static setPerpendicularityDependencyBaseOnPoints(line1Point1Id: number, line1Point2Id: number, line2Point1Id: number, line2Point2Id: number) {
        CanvasManagerInterface.manager.setPerpendicularityDependencyBaseOnPoints(line1Point1Id, line1Point2Id, line2Point1Id, line2Point2Id);
    }

    public static createPerpendicularLineToLine(lineId: number, pointId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createPerpendicularLineToLine(lineId, pointId);
    }

    public static setParallelismDependency(line1Id: number, line2Id: number) {
        CanvasManagerInterface.manager.setParallelismDependency(line1Id, line2Id);
    }

    public static setParallelismDependencyBaseOnPoints(line1Point1Id: number, line1Point2Id: number, line2Point1Id: number, line2Point2Id: number) {
        CanvasManagerInterface.manager.setParallelismDependencyBaseOnPoints(line1Point1Id, line1Point2Id, line2Point1Id, line2Point2Id);
    }

    public static createParallelLineToLine(lineId: number, pointId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createParallelLineToLine(lineId, pointId);
    }

    public static setEqualSegmentsDependencyWithEnds(segment1End1Id: number, segment1End2Id: number, segment2End1Id: number, segment2End2Id: number) {
        CanvasManagerInterface.manager.setEqualSegmentsDependencyWithEnds(segment1End1Id, segment1End2Id, segment2End1Id, segment2End2Id);
    }

    public static setEqualSegmentsDependnecyWithIds(segment1Id: number, segment2Id: number) {
        CanvasManagerInterface.manager.setEqualSegmentsDependnecyWithIds(segment1Id, segment2Id);
    }

    public static setEqualSegmentsDependencyWithMix(segment1Id: number, segment2End1Id: number, segment2End2Id: number) {
        CanvasManagerInterface.manager.setEqualSegmentsDependencyWithMix(segment1Id, segment2End1Id, segment2End2Id);
    }

    public static setEqualAnglesDependency(angle1Point1Id: number, angle1VertexId: number, angle1Point2Id: number, angle2Point1Id: number, angle2VertexId: number, angle2Point2Id: number) {
        CanvasManagerInterface.manager.setEqualAnglesDependency(angle1Point1Id, angle1VertexId, angle1Point2Id, angle2Point1Id, angle2VertexId, angle2Point2Id);
    }

    public static setLengthValue(end1Id: number, end2Id: number, value: string) {
        CanvasManagerInterface.manager.setLengthValue(end1Id, end2Id, value);
    }

    public static setSegmentLengthValue(segmentId: number, value: string) {
        CanvasManagerInterface.manager.setSegmentLengthValue(segmentId, value);
    }

    public static setAngleValue(end1Id: number, vertexId: number, end2Id: number, angleType: AngleTypeEnum, value: string) {
        CanvasManagerInterface.manager.setAngleValue(end1Id, vertexId, end2Id, AngleTypeEnumToRaw(angleType), value);
    }

    public static divideSegmentWithId(segmentId: number, n: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.divideSegmentWithId(segmentId, n);
    }

    public static divideSegmentWithEnds(end1Id: number, end2Id: number, n: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.divideSegmentWithEnds(end1Id, end2Id, n);
    }

    public static divideAngle(end1Id: number, vertexId: number, end2Id: number, ofConvexAngle: boolean, n: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.divideAngle(end1Id, vertexId, end2Id, ofConvexAngle, n);
    }

    public static createSegmentMidPerpendicularWithId(segmentId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createSegmentMidPerpendicularWithId(segmentId);
    }

    public static createSegmentMidPerpendicularWithEnds(end1Id: number, end2Id: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createSegmentMidPerpendicularWithEnds(end1Id, end2Id);
    }

    public static createTangentLine(circleId: number, pointId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createTangentLine(pointId, circleId);
    }

    public static createTangentCircleToLine(pointId: number, segmentId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createTangentCircleToLine(pointId, segmentId);
    }

    public static createTangentCircleToCircle(circleId: number, newCircleCenterId: number, externally: boolean) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createTangentCircleToCircle(circleId, newCircleCenterId, externally);
    }

    public static createAltitudeWithBaseId(baseId: number, vertexId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createAltitudeWithBaseId(baseId, vertexId);
    }

    public static createAltitudeWithBaseEnds(end1Id: number, end2Id: number, vertexId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createAltitudeWithBaseEnds(end1Id, end2Id, vertexId);
    }

    public static createMedianWithBaseId(baseId: number, vertexId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createMedianWithBaseId(baseId, vertexId);
    }

    public static createMedianwithBaseEnds(end1Id: number, end2Id: number, vertexId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createMedianwithBaseEnds(end1Id, end2Id, vertexId);
    }

    public static createMidSegmentWithArmIds(arm1Id: number, arm2Id: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createMidSegmentWithArmIds(arm1Id, arm2Id);
    }

    public static createMidSegmentWithArmEnds(arm1End1Id: number, arm1End2Id: number, arm2End1Id: number, arm2End2Id: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createMidSegmentWithArmEnds(arm1End1Id, arm1End2Id, arm2End1Id, arm2End2Id);
    }

    public static createMidSegmentWithMix(arm1Id: number, arm2End1Id: number, arm2End2Id: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createMidSegmentWithMix(arm1Id, arm2End1Id, arm2End2Id)
    }

    public static createBisectorLine(point1Id: number, vertexId: number, point2Id: number, ofConvexAngle: boolean) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createBisectorLine(point1Id, vertexId, point2Id, ofConvexAngle);
    }

    public static createInscribedCircle(ids: number[]) {
        CanvasManagerInterface.lockUI();

        var vertexVector = new Module.vectorOfUnsignedInts();
        ids.forEach(id => { vertexVector.push_back(id); });
        CanvasManagerInterface.manager.createInscribedCircle(vertexVector);
    }

    public static createCircumscribedCircle(ids: number[]) {
        CanvasManagerInterface.lockUI();

        var vertexVector = new Module.vectorOfUnsignedInts();
        ids.forEach(id => { vertexVector.push_back(id); });
        CanvasManagerInterface.manager.createCircumscribedCircle(vertexVector);
    }

    public static createEscribedCircleWithSideId(sideId: number, vertexId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createEscribedCircleWithSideId(sideId, vertexId);
    }

    public static createEscribedCircleWithSideEnds(end1Id: number, end2Id: number, vertexId: number) {
        CanvasManagerInterface.lockUI();

        CanvasManagerInterface.manager.createEscribedCircleWithSideEnds(end1Id, end2Id, vertexId);
    }

    public static setPolygonType(polygon: number[], type: PolygonTypeEnum) {
        var vertexVector = new Module.vectorOfUnsignedInts();
        polygon.forEach(id => { vertexVector.push_back(id); });

        CanvasManagerInterface.manager.setPolygonType(vertexVector, PolygonTypeEnumToRaw(type));
    }

    public static setPerpendicularLines(line1: number, line2: number) {
        CanvasManagerInterface.manager.setPerpendicularLines(line1, line2);
    }

    public static setParallelLines(line1: number, line2: number) {
        CanvasManagerInterface.manager.setParallelLines(line1, line2);
    }

    public static setEscribedCircle(circleId: number, polygon: number[]) {
        var vertexVector = new Module.vectorOfUnsignedInts();
        polygon.forEach(id => { vertexVector.push_back(id); });

        CanvasManagerInterface.manager.setEscribedCircle(circleId, vertexVector);
    }

    public static setInscribedCircle(circleId: number, polygon: number[]) {
        var vertexVector = new Module.vectorOfUnsignedInts();
        polygon.forEach(id => { vertexVector.push_back(id); });

        CanvasManagerInterface.manager.setInscribedCircle(circleId, vertexVector);
    }

    public static setCircumscribedCircle(circleId: number, polygon: number[]) {
        var vertexVector = new Module.vectorOfUnsignedInts();
        polygon.forEach(id => { vertexVector.push_back(id); });

        CanvasManagerInterface.manager.setCircumscribedCircle(circleId, vertexVector);
    }

    public static setTangentLineToCircle(lineId: number, circleId: number) {
        CanvasManagerInterface.manager.setTangentLineToCircle(lineId, circleId);
    }

    public static setTangentCircles(circle1Id: number, circle2Id: number) {
        CanvasManagerInterface.manager.setTangentCircles(circle1Id, circle2Id);
    }

    public static setAltitude(end1Id: number, end2Id: number, lineId: number) {
        CanvasManagerInterface.manager.setAltitude(end1Id, end2Id, lineId);
    }

    public static setMedian(s1End1Id: number, s1End2Id: number, s2End1Id: number, s2End2Id: number) {
        CanvasManagerInterface.manager.setMedian(s1End1Id, s1End2Id, s2End1Id, s2End2Id);
    }

    public static setMidSegment(a1End1Id: number, a1End2Id: number, a2End1Id: number, a2End2Id: number, sEnd1: number, sEnd2: number) {
        CanvasManagerInterface.manager.setMidSegment(a1End1Id, a1End2Id, a2End1Id, a2End2Id, sEnd1, sEnd2);
    }

    public static getJsonData(): JSON {
        const JsonAsString: string = CanvasManagerInterface.manager.getJsonData();

        return JSON.parse(JsonAsString);
    }
}
