import { Canvas } from "../canvas"
import { BehaviorSubject } from "rxjs";
import { ShapesCreatorComponent } from "../shapes-creator/shapes-creator.component";
import { Appearance } from "../appearance";

/**
 * Enum defined in: compute-service/brain/models.py
 */
 export enum AngleTypeEnum {
    UNKNOWN,
    CONVEX,
    CONCAVE,
}

export enum LineTypeEnum {
    VERTICAL,
    HORIZONTAL,
    SLANTED
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

/**
 * Enum defined in: compute-service/brain/models.py
 */
export enum DependencyCategoryEnum {
    FORMULA,
    POLYGON_TYPE,
    OF_POINTS_PAIRS,
    OF_LINES,
    OF_CIRCLES,
    OF_ANGLES,
    OF_LINE_AND_ANGLE,
    OF_LINE_AND_CIRCLE,
    OF_LINE_AND_POINTS_PAIR,
    OF_CIRCLE_AND_POLYGON,
    OF_POINTS_PAIRS_PAIR_AND_POINTS_PAIR,
    OF_POLYGONS
}

export enum DependencyTypeEnum {
    SEGMENT_LENGTH,
    ANGLE_VALUE,
    EQUATION,
    POLYGON_TYPE,
    EQUAL_SEGMENTS,
    EQUAL_ANGLES,
    PERPENDICULAR_LINES,
    PARALLEL_LINES,
    TANGENT_LINE_TO_CIRCLE,
    TANGENT_CIRCLE_TO_CIRCLE,
    BISECTOR_LINE,
    MID_PERPENDICULAR_LINE,
    INSCRIBED_CIRCLE,
    CIRCUMSCRIBED_CIRCLE,
    ESCRIBED_CIRCLE,
    MEDIAN,
    ALTITUDE,
    MID_SEGMENT,
    SIMILAR_TRIANGLES,
    CONGRUENT_TRIANGLES
}

/**
 * Enum defined in: compute-service/brain/models.py
 */
 export enum DependencyReasonEnum {
    NONE,
    USER_DEFINED,
    DIVIDED_SEGMENT,
    MID_PERPENDICULAR,
    TANGENT_TO_CIRCLE,
    TANGENT_TO_LINE,
    ALTITUDE,
    MEDIAN,
    MID_SEGMENT,
    BISECTOR,
    INSCRIBED_CIRCLE,
    CIRCUMSCRIBED_CIRCLE,
    ESCRIBED_CIRCLE,
    SQUARE,
    SQUARE_DIAGONAL,
    RECTANGLE,
    RECTANGLE_DIAGONAL,
    REGULAR_POLYGON,
    PARALLELOGRAM,
    PARALLELOGRAM_DIAGONAL,
    KITE,
    KITE_DIAGONAL,
    RHOMBUS,
    RHOMBUS_DIAGONAL,
    ISOSCELES_ACUTE_TRIANGLE,
    EQUILATERAL_TRIANGLE,
    SCALENE_RIGHT_TRIANGLE,
    ISOSCELES_RIGHT_TRIANGLE,
    OBTUSE_ISOSCELES_TRIANGLE,
    SCALENE_TRAPEZOID,
    ISOSCELES_TRAPEZOID,
    ISOSCELES_TRAPEZOID_DIAGONAL,
    RIGHT_TRAPEZOID,
    POINTS_ARE_THE_SAME,
    ARMS_ARE_THE_SAME,
    VERTICAL_ANGLES,
    SUPPLEMENTARY_ANGLES,
    ALTERNATE_ANGLES,
    CORRESPONDING_ANGLES,
    PERPENDICULAR_LINES,
    PARALLEL_LINES,
    PARALLELISM_TRANSITIVITY,
    PERPENDICULARITIES_COMPOSITION,
    PERPENDICULARITY_AND_PARALLELISM_COMPOSITION,
    RIGHT_ANGLE,
    SUM_OF_ANGLES_IN_TRIANGLE,
    SIMILAR_TRIANGLES,
    SIDE_SIDE_SIDE,
    ANGLE_ANGLE_ANGLE,
    CONGRUENT_TRIANGLES,
    SIDE_ANGLE_SIDE,
    ANGLE_SIDE_ANGLE,
    SAME_ARMS,
	FUNDAMENTAL_THEORY_OF_GEOMETRY
}

export enum UsefullnessLevel {
    LOW,
    MEDIUM,
    HIGH
}

export interface IdHolder {
    id: number;
}

/**
 * PointModel defined in web-app/canvas-manager/canvas/main_canvas.py in function process_data
 */
export interface PointModel {
    id: number;
    x: number;
    y: number;
}

export interface PointModelRecord {
    ID: number;
    object: PointModel;
}

/**
 * LineModel defined in web-app/canvas-manager/canvas/main_canvas.py in function process_data
 */
export interface LineModel {
    id: number;
    a: number;
    b: number;
    end1ID: number;
    end2ID: number;
    type: LineTypeEnum;
    pointsOn: number[];
}

export interface LineModelRecord {
    ID: number;
    object: LineModel;
}

/**
 * CircleModel defined in web-app/canvas-manager/canvas/main_canvas.py in function process_data
 */
export interface CircleModel {
    id: number;
    centerId: number;
    centerX: number;
    centerY: number;
    radius: number;
    pointsOn: number[];
}

export interface CircleModelRecord {
    ID: number;
    object: CircleModel;
}

export interface AngleModel {
    point1Id: number;
    vertexId: number;
    point2Id: number;
    type: AngleTypeEnum;
}

export interface PointsPairModel {
    end1Id: number;
    end2Id: number;
}

export interface Formula {
    value: string;
    variables: string[];
}

export interface PolygonModel {
    verticesIds: number[];
}

export interface ModelsPairModel<Type> {
    first: Type;
    second: Type;
}

export interface DependencyRecord<Type1, Type2> {
    object1: Type1;
    object2: Type2;
    id: number;
    category: DependencyCategoryEnum;
    type: DependencyTypeEnum;
    reason: DependencyReasonEnum;
    basedOn: number[];
    usefullness: UsefullnessLevel;
}

export interface Intersections {
    line_line: number[][][];
    circle_circle: number[][][];
    line_circle: number[][][];
    points_on_line_line: [number, number][][];
    points_on_circle_circle: [number, number][][];
    points_on_line_circle: [number, number][][];
}

export interface Dependencies {
    type: DependencyTypeEnum;
    dependencies: (
        DependencyRecord<Formula, Formula> |
        DependencyRecord<PolygonModel, PolygonTypeEnum> |
        DependencyRecord<IdHolder, IdHolder> |
        DependencyRecord<PointsPairModel, PointsPairModel> |
        DependencyRecord<AngleModel, AngleModel> |
        DependencyRecord<IdHolder, AngleModel> |
        DependencyRecord<IdHolder, PolygonModel> |
        DependencyRecord<IdHolder, PointsPairModel> |
        DependencyRecord<PolygonModel, PolygonModel> |
        DependencyRecord<ModelsPairModel<PointsPairModel>, PointsPairModel>
    )[];
}

export interface VariableIndexes {
    name: string;
    ids: [number, number] | [number, number, number, number];
}

/**
 * ProcessedDataModel represents result data model defined in web-app/canvas-manager/canvas/main_canvas.py in function process_data
 */
export interface ProcessedDataModel {
    points: PointModelRecord[];
    lines: LineModelRecord[];
    circles: CircleModelRecord[];
    intersections: Intersections;
    dependencies: Dependencies[];
    indexes_of_variables: VariableIndexes[];
}

export function createPointName(id: number): string {
    let letters = "ABCDEFGHIJKLMNOPQRSTUWVXYZ";
    let name = letters.charAt(id % letters.length);

    // if there are more points than letters of the alphabet, add apostrophes 
    while (id > (letters.length - 1)) {
        name += "'";
        id -= letters.length;
    }

    return name;
}

export function createLineName(id: number): string {
    let letters = "abcdefghijklmnopqrstuwvxyz";
    let name = letters.charAt(id % letters.length);

    // if there are more points than letters of the alphabet, add apostrophes 
    while (id > (letters.length - 1)) {
        name += "'";
        id -= letters.length;
    }

    return name;
}

export function createCircleName(id: number): string {
    return "circle with id = " + id;
} 

export function createSegmentName(end1Id: number, end2Id:  number): string {
    return createPointName(end1Id) + createPointName(end2Id);
}

export function createAngleName(point1Id: number, vertexId: number, point2Id: number, type: AngleTypeEnum): string {
    return createPointName(point1Id) + createPointName(vertexId) + createPointName(point2Id) + "[" + AngleTypeEnum[type] + "]";
}

export function createPolygonName(polygon: number[]): string {
    let name = "";
    for(let i = 0; i < polygon.length; i++) {
        name += createPointName(polygon[i]);
    }

    return name;
}

export class DependenciesPresenter {
    public static displayDependenciesPresenter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public static dependencyTitle$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    public static dependencyDescription$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    public static dependencyReason$: BehaviorSubject<string> = new BehaviorSubject<string>("");

    public static dependencyTypes: string[] = Object.keys(DependencyTypeEnum).filter((v) => isNaN(Number(v)));
    public static selectedTypes$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(DependenciesPresenter.dependencyTypes);

    private static dataModel: ProcessedDataModel;

    private static points: PointModelRecord[];
    private static lines: LineModelRecord[];
    private static circles: CircleModelRecord[];

    private static dependenciesArray: (
        DependencyRecord<Formula, Formula> |
        DependencyRecord<PolygonModel, PolygonTypeEnum> |
        DependencyRecord<IdHolder, IdHolder> |
        DependencyRecord<PointsPairModel, PointsPairModel> |
        DependencyRecord<AngleModel, AngleModel> |
        DependencyRecord<IdHolder, AngleModel> |
        DependencyRecord<IdHolder, PolygonModel> |
        DependencyRecord<IdHolder, PointsPairModel> |
        DependencyRecord<PolygonModel, PolygonModel> |
        DependencyRecord<ModelsPairModel<PointsPairModel>, PointsPairModel>
    )[];
            
    private static dependenciesArrayLength: number;
    private static currentIndex: number;

    private static highlightColors: string[];

    private static targetUsefullness: UsefullnessLevel[];

    private static variableToIndexes: { [key: string] : [number, number] | [number, number, number, number]; }

    private static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private static getRandomColors(colorsNumber: number): string[] {
        let variousIndexes: number[] = [];
        let result: string[] = [];
        let index: number;
        let n = DependenciesPresenter.highlightColors.length - 1;

        for(let i = 0; i < colorsNumber; i++) {
            do {
                index = DependenciesPresenter.getRandomInt(0, n);
            } while (variousIndexes.includes(index));

            variousIndexes.push(index);
        }

        for(let i = 0; i < colorsNumber; i++) {
            result.push(DependenciesPresenter.highlightColors[variousIndexes[i]]);
        }

        return result;
    }

    public static presentDependencies(data: ProcessedDataModel): void {
        DependenciesPresenter.dataModel = data;
        DependenciesPresenter.points = data.points;
        DependenciesPresenter.lines = data.lines;
        DependenciesPresenter.circles = data.circles;

        DependenciesPresenter.selectedTypes$.next(DependenciesPresenter.dependencyTypes);
        ShapesCreatorComponent.displayShapesCreator$.next(false);
        DependenciesPresenter.displayDependenciesPresenter$.next(true);
        DependenciesPresenter.dependencyTitle$.next("");
        DependenciesPresenter.dependencyDescription$.next("");
        DependenciesPresenter.dependencyReason$.next("");

        DependenciesPresenter.highlightColors = Appearance.highlightColors;
        DependenciesPresenter.targetUsefullness = [/*UsefullnessLevel.LOW,*/ UsefullnessLevel.MEDIUM, UsefullnessLevel.HIGH];

        DependenciesPresenter.variableToIndexes = { };
        
        if(data.indexes_of_variables != null) {
            data.indexes_of_variables.forEach(el => {
                DependenciesPresenter.variableToIndexes[el.name] = el.ids;
            });
        }

        DependenciesPresenter.selectedTypes$.subscribe(newSelectedTypes => {
            let dependencies = DependenciesPresenter.dataModel.dependencies;
            DependenciesPresenter.dependenciesArray = [];

            dependencies.forEach(e1 => {
                let d = e1.dependencies;
                if(d != null) {
                    d.forEach(e2 => {
                        if(newSelectedTypes.includes(DependencyTypeEnum[e2.type])) {
                            if(DependenciesPresenter.targetUsefullness.includes(e2.usefullness)) {
                                DependenciesPresenter.dependenciesArray.push(e2);
                            }
                        }
                    });
                }
            });

            DependenciesPresenter.dependenciesArrayLength = DependenciesPresenter.dependenciesArray.length;
            DependenciesPresenter.currentIndex = 0;

            DependenciesPresenter.nextDependency();
        });
    }

    public static highlightVariables(variables: string[]): void {
        variables.forEach(v => {
            let obj = DependenciesPresenter.variableToIndexes[v]; 
            if(obj.length == 2) {
                let lineend1 = DependenciesPresenter.points[obj[0]].object;
                let lineend2 = DependenciesPresenter.points[obj[1]].object;

                Canvas.highlightPolyLine([[lineend1.x, lineend1.y], [lineend2.x, lineend2.y]], false, DependenciesPresenter.getRandomColors(1)[0], null);
            }
            else { // obj.length == 4
                let angleend1 = DependenciesPresenter.points[obj[0]].object;
                let anglevertex = DependenciesPresenter.points[obj[1]].object;
                let angleend2 = DependenciesPresenter.points[obj[2]].object;
                let angleisConvex = (obj[3] == 0);

                Canvas.highlightAngle([angleend1.x, angleend1.y], [anglevertex.x, anglevertex.y], [angleend2.x, angleend2.y], angleisConvex, DependenciesPresenter.getRandomColors(1)[0], [1, 2]);
            }
        });
    }

    public static nextDependency(): void {
        if(DependenciesPresenter.dependenciesArray.length == 0) {
            DependenciesPresenter.dependencyTitle$.next("");
            DependenciesPresenter.dependencyDescription$.next("");
            DependenciesPresenter.dependencyReason$.next("");
        }
        else {
            let dependency = DependenciesPresenter.dependenciesArray[DependenciesPresenter.currentIndex];

            let line1end1 : PointModel, line1end2 : PointModel, line2end1 : PointModel, line2end2 : PointModel, line3end1 : PointModel, line3end2 : PointModel;
            let angle1end1 : PointModel, angle1vertex : PointModel, angle1end2 : PointModel, angle1isConvex : boolean;
            let angle2end1 : PointModel, angle2vertex : PointModel, angle2end2 : PointModel, angle2isConvex : boolean;
            let polygon1: [number, number][], polygon2 : [number, number][], circle1 : CircleModel, circle2 : CircleModel;
            let colors: string[];

            if(dependency != null) {
                Canvas.clearHighlightedShapes();

                DependenciesPresenter.dependencyTitle$.next(DependencyTypeEnum[dependency.type]);
                DependenciesPresenter.dependencyReason$.next('because ' + DependencyReasonEnum[dependency.reason]);

                switch(dependency.category) {
                    case DependencyCategoryEnum.FORMULA:
                        switch(dependency.type) {
                            case DependencyTypeEnum.SEGMENT_LENGTH:
                                dependency = <DependencyRecord<Formula, Formula>> dependency;
                                DependenciesPresenter.highlightVariables(dependency.object1.variables);
                                DependenciesPresenter.highlightVariables(dependency.object2.variables);
                                
                                DependenciesPresenter.dependencyDescription$.next(dependency.object1.value + " = " + dependency.object2.value);
                                break;
                            case DependencyTypeEnum.ANGLE_VALUE:
                                dependency = <DependencyRecord<Formula, Formula>> dependency;
                                DependenciesPresenter.highlightVariables(dependency.object1.variables);
                                DependenciesPresenter.highlightVariables(dependency.object2.variables);
                                
                                DependenciesPresenter.dependencyDescription$.next(dependency.object1.value + " = " + dependency.object2.value);
                                break;
                            case DependencyTypeEnum.EQUATION:
                                dependency = <DependencyRecord<Formula, Formula>> dependency;
                                DependenciesPresenter.highlightVariables(dependency.object1.variables);
                                DependenciesPresenter.highlightVariables(dependency.object2.variables);

                                DependenciesPresenter.dependencyDescription$.next(dependency.object1.value + " = " + dependency.object2.value);
                                break;
                            default:
                                alert("NIEUWZGLEDNIONA MOZLIWOSC!");
                                break;
                        }
                        break;
                    case DependencyCategoryEnum.POLYGON_TYPE:
                        dependency = <DependencyRecord<IdHolder, PolygonModel>> dependency;
                        polygon1 = dependency.object2.verticesIds.map((id) => [DependenciesPresenter.points[id].object.x, DependenciesPresenter.points[id].object.y]);
                        colors = DependenciesPresenter.getRandomColors(1);

                        Canvas.highlightPolyLine(polygon1, true, colors[0], null);
                        DependenciesPresenter.dependencyDescription$.next(createPolygonName(dependency.object2.verticesIds) + ' is ' + PolygonTypeEnum[dependency.object1.id]);
                        break;
                    case DependencyCategoryEnum.OF_POINTS_PAIRS:
                        dependency = <DependencyRecord<PointsPairModel, PointsPairModel>> dependency;
                        line1end1 = DependenciesPresenter.points[dependency.object1.end1Id].object;
                        line1end2 = DependenciesPresenter.points[dependency.object1.end2Id].object;
                        line2end1 = DependenciesPresenter.points[dependency.object2.end1Id].object;
                        line2end2 = DependenciesPresenter.points[dependency.object2.end2Id].object;
                        colors = DependenciesPresenter.getRandomColors(2);

                        Canvas.highlightPolyLine([[line1end1.x, line1end1.y], [line1end2.x, line1end2.y]], false, colors[0], null);
                        Canvas.highlightPolyLine([[line2end1.x, line2end1.y], [line2end2.x, line2end2.y]], false, colors[1], null);
                        DependenciesPresenter.dependencyDescription$.next(createSegmentName(dependency.object1.end1Id, dependency.object1.end2Id) + ' and ' + createSegmentName(dependency.object2.end1Id, dependency.object2.end2Id));
                        break;
                    case DependencyCategoryEnum.OF_LINES:
                        dependency = <DependencyRecord<IdHolder, IdHolder>> dependency;
                        line1end1 = DependenciesPresenter.points[DependenciesPresenter.lines[dependency.object1.id].object.end1ID].object;
                        line1end2 = DependenciesPresenter.points[DependenciesPresenter.lines[dependency.object1.id].object.end2ID].object;
                        line2end1 = DependenciesPresenter.points[DependenciesPresenter.lines[dependency.object2.id].object.end1ID].object;
                        line2end2 = DependenciesPresenter.points[DependenciesPresenter.lines[dependency.object2.id].object.end2ID].object;
                        colors = DependenciesPresenter.getRandomColors(2);

                        Canvas.highlightPolyLine([[line1end1.x, line1end1.y], [line1end2.x, line1end2.y]], false, colors[0], null);
                        Canvas.highlightPolyLine([[line2end1.x, line2end1.y], [line2end2.x, line2end2.y]], false, colors[1], null);
                        DependenciesPresenter.dependencyDescription$.next(createLineName(dependency.object1.id) + ' and ' + createLineName(dependency.object2.id));
                        break;
                    case DependencyCategoryEnum.OF_CIRCLES:
                        dependency = <DependencyRecord<IdHolder, IdHolder>> dependency;
                        circle1 = DependenciesPresenter.circles[dependency.object1.id].object;
                        circle2 = DependenciesPresenter.circles[dependency.object2.id].object;
                        colors = DependenciesPresenter.getRandomColors(2);

                        Canvas.highlightCircle(circle1.centerX, circle1.centerY, circle1.radius, colors[0], null);
                        Canvas.highlightCircle(circle2.centerX, circle2.centerY, circle2.radius, colors[1], null);
                        DependenciesPresenter.dependencyDescription$.next(createCircleName(dependency.object1.id) + ' and ' + createCircleName(dependency.object2.id));
                        break;
                    case DependencyCategoryEnum.OF_ANGLES:
                        dependency = <DependencyRecord<AngleModel, AngleModel>> dependency;
                        angle1end1 = DependenciesPresenter.points[dependency.object1.point1Id].object;
                        angle1vertex = DependenciesPresenter.points[dependency.object1.vertexId].object;
                        angle1end2 = DependenciesPresenter.points[dependency.object1.point2Id].object;
                        angle1isConvex = (dependency.object1.type == AngleTypeEnum.CONVEX);
                        angle2end1 = DependenciesPresenter.points[dependency.object2.point1Id].object;
                        angle2vertex = DependenciesPresenter.points[dependency.object2.vertexId].object;
                        angle2end2 = DependenciesPresenter.points[dependency.object2.point2Id].object;
                        angle2isConvex = (dependency.object2.type == AngleTypeEnum.CONVEX);
                        colors = DependenciesPresenter.getRandomColors(2);

                        Canvas.highlightAngle([angle1end1.x, angle1end1.y], [angle1vertex.x, angle1vertex.y], [angle1end2.x, angle1end2.y], angle1isConvex, colors[0], [1, 2]);
                        Canvas.highlightAngle([angle2end1.x, angle2end1.y], [angle2vertex.x, angle2vertex.y], [angle2end2.x, angle2end2.y], angle2isConvex, colors[1], [2, 3]);
                        DependenciesPresenter.dependencyDescription$.next(createAngleName(dependency.object1.point1Id, dependency.object1.vertexId, dependency.object1.point2Id, dependency.object1.type) + ' and ' + createAngleName(dependency.object2.point1Id, dependency.object2.vertexId, dependency.object2.point2Id, dependency.object2.type));
                        break;
                    case DependencyCategoryEnum.OF_LINE_AND_ANGLE:
                        dependency = <DependencyRecord<IdHolder, AngleModel>> dependency;
                        line1end1 = DependenciesPresenter.points[DependenciesPresenter.lines[dependency.object1.id].object.end1ID].object;
                        line1end2 = DependenciesPresenter.points[DependenciesPresenter.lines[dependency.object1.id].object.end2ID].object;
                        angle2end1 = DependenciesPresenter.points[dependency.object2.point1Id].object;
                        angle2vertex = DependenciesPresenter.points[dependency.object2.vertexId].object;
                        angle2end2 = DependenciesPresenter.points[dependency.object2.point2Id].object;
                        angle2isConvex = (dependency.object2.type == AngleTypeEnum.CONVEX);
                        colors = DependenciesPresenter.getRandomColors(2);

                        Canvas.highlightPolyLine([[line1end1.x, line1end1.y], [line1end2.x, line1end2.y]], false, colors[0], null);
                        Canvas.highlightAngle([angle2end1.x, angle2end1.y], [angle2vertex.x, angle2vertex.y], [angle2end2.x, angle2end2.y], angle2isConvex, colors[1], [2, 3]);
                        DependenciesPresenter.dependencyDescription$.next(createLineName(dependency.object1.id) + ' and ' + createAngleName(dependency.object2.point1Id, dependency.object2.vertexId, dependency.object2.point2Id, dependency.object2.type));
                        break;
                    case DependencyCategoryEnum.OF_LINE_AND_CIRCLE:
                        dependency = <DependencyRecord<IdHolder, IdHolder>> dependency;
                        line1end1 = DependenciesPresenter.points[DependenciesPresenter.lines[dependency.object1.id].object.end1ID].object;
                        line1end2 = DependenciesPresenter.points[DependenciesPresenter.lines[dependency.object1.id].object.end2ID].object;
                        circle2 = DependenciesPresenter.circles[dependency.object2.id].object;
                        colors = DependenciesPresenter.getRandomColors(2);

                        Canvas.highlightPolyLine([[line1end1.x, line1end1.y], [line1end2.x, line1end2.y]], false, colors[0], null);
                        Canvas.highlightCircle(circle2.centerX, circle2.centerY, circle2.radius, colors[1], null);
                        DependenciesPresenter.dependencyDescription$.next(createLineName(dependency.object1.id) + ' and ' + createCircleName(dependency.object2.id));
                        break;
                    case DependencyCategoryEnum.OF_LINE_AND_POINTS_PAIR:
                        dependency = <DependencyRecord<IdHolder, PointsPairModel>> dependency;
                        line1end1 = DependenciesPresenter.points[DependenciesPresenter.lines[dependency.object1.id].object.end1ID].object;
                        line1end2 = DependenciesPresenter.points[DependenciesPresenter.lines[dependency.object1.id].object.end2ID].object;
                        line2end1 = DependenciesPresenter.points[dependency.object2.end1Id].object;
                        line2end2 = DependenciesPresenter.points[dependency.object2.end2Id].object;
                        colors = DependenciesPresenter.getRandomColors(2);

                        Canvas.highlightPolyLine([[line1end1.x, line1end1.y], [line1end2.x, line1end2.y]], false, colors[0], null);
                        Canvas.highlightPolyLine([[line2end1.x, line2end1.y], [line2end2.x, line2end2.y]], false, colors[1], null);
                        DependenciesPresenter.dependencyDescription$.next(createLineName(dependency.object1.id) + ' and ' + createSegmentName(dependency.object2.end1Id, dependency.object2.end2Id));
                        break;
                    case DependencyCategoryEnum.OF_CIRCLE_AND_POLYGON:
                        dependency = <DependencyRecord<IdHolder, PolygonModel>> dependency;
                        circle1 = DependenciesPresenter.circles[dependency.object1.id].object;
                        polygon2 = dependency.object2.verticesIds.map((id) => [DependenciesPresenter.points[id].object.x, DependenciesPresenter.points[id].object.y]);
                        colors = DependenciesPresenter.getRandomColors(2);

                        Canvas.highlightCircle(circle1.centerX, circle1.centerY, circle1.radius, colors[0], null);
                        Canvas.highlightPolyLine(polygon2, true, colors[1], null);
                        DependenciesPresenter.dependencyDescription$.next(createCircleName(dependency.object1.id) + ' and ' + createPolygonName(dependency.object2.verticesIds));
                        break;
                    case DependencyCategoryEnum.OF_POINTS_PAIRS_PAIR_AND_POINTS_PAIR:
                        dependency = <DependencyRecord<ModelsPairModel<PointsPairModel>, PointsPairModel>> dependency;
                        line1end1 = DependenciesPresenter.points[dependency.object1.first.end1Id].object
                        line1end2 = DependenciesPresenter.points[dependency.object1.first.end2Id].object
                        line2end1 = DependenciesPresenter.points[dependency.object1.second.end1Id].object
                        line2end2 = DependenciesPresenter.points[dependency.object1.second.end2Id].object
                        line3end1 = DependenciesPresenter.points[dependency.object2.end1Id].object
                        line3end2 = DependenciesPresenter.points[dependency.object2.end2Id].object
                        colors = DependenciesPresenter.getRandomColors(2);

                        Canvas.highlightPolyLine([[line1end1.x, line1end1.y], [line1end2.x, line1end2.y]], false, colors[0], null);
                        Canvas.highlightPolyLine([[line2end1.x, line2end1.y], [line2end2.x, line2end2.y]], false, colors[0], null);
                        Canvas.highlightPolyLine([[line3end1.x, line3end1.y], [line3end2.x, line3end2.y]], false, colors[1], null);
                        DependenciesPresenter.dependencyDescription$.next(createSegmentName(dependency.object1.first.end1Id, dependency.object1.first.end2Id) + ' with ' + createSegmentName(dependency.object1.second.end1Id, dependency.object1.second.end2Id) + ' and ' + createSegmentName(dependency.object2.end1Id, dependency.object2.end2Id));
                        break;
                    case DependencyCategoryEnum.OF_POLYGONS:
                        dependency = <DependencyRecord<PolygonModel, PolygonModel>> dependency;
                        polygon1 = dependency.object1.verticesIds.map((id) => [DependenciesPresenter.points[id].object.x, DependenciesPresenter.points[id].object.y]);
                        polygon2 = dependency.object2.verticesIds.map((id) => [DependenciesPresenter.points[id].object.x, DependenciesPresenter.points[id].object.y]);
                        colors = DependenciesPresenter.getRandomColors(2);

                        Canvas.highlightPolyLine(polygon1, true, colors[0], null);
                        Canvas.highlightPolyLine(polygon2, true, colors[1], null);
                        DependenciesPresenter.dependencyDescription$.next(createPolygonName(dependency.object1.verticesIds) + ' and ' + createPolygonName(dependency.object2.verticesIds));
                        break;
                    default:
                        alert("NIEUWZGLEDNIONA MOZLIWOSC!!!");
                        break;
                }
            }

            DependenciesPresenter.currentIndex = (DependenciesPresenter.currentIndex + 1) % DependenciesPresenter.dependenciesArrayLength;
    
        }
    }

    public static cancelPresenting(): void {
        Canvas.clearHighlightedShapes();
        DependenciesPresenter.displayDependenciesPresenter$.next(false);
        ShapesCreatorComponent.displayShapesCreator$.next(true);
    }
}