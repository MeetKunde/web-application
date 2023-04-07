/**
 * Module contains a function to display raw data from compute-service as a basic HTML page.
 * 
 * @module Display Processed Data
 */


import { AngleTypeEnum, ProcessedDataModel, PointsPairModel, LineTypeEnum, DependencyRecord, DependencyCategoryEnum, DependencyTypeEnum, DependencyReasonEnum, createLineName, createSegmentName, createAngleName, Formula, AngleModel, PolygonModel, PolygonTypeEnum, createPolygonName, IdHolder, createCircleName, ModelsPairModel, UsefullnessLevel } from "./dependencies-presenter";

/**
 * Creating HTML page with raw data from compute-service
 * @param data information from compute-service
 * @param pointNames array representing names of points: pointNames[i] is name of point with "i" ID
 * @returns HTML code representing created page
 */
export function display_processed_data(data: ProcessedDataModel, pointNames: string[]): string {
    let newPointNames: { [id: number]: number; } = {};

    let points_html_string = "";
    if (data['points'] != null) {
        for (var point of data['points']) {
            newPointNames[point['ID']] = point.object['id'];

            points_html_string += `
                <h4>ID ${point['ID']} = ${pointNames[point.object['id']]}:</h4> 
                <p>id = ${point.object['id']}</p>
                <p>(${point.object['x']}, ${point.object['y']})</p><br>`
        }
    }

    let lines_html_string = "";
    if (data['lines'] != null) {
        for (var line of data['lines']) {
            lines_html_string += `
                <h4>ID ${line['ID']} = ${createLineName(line.object['id'])}:</h4>
                <p>id = ${line.object['id']}</p>`
            if (line.object['type'] == LineTypeEnum.VERTICAL) {
                lines_html_string += `<p>x = ${line.object['b']}</p>`
            }
            else if (line.object['type'] == LineTypeEnum.HORIZONTAL) {
                lines_html_string += `<p>y = ${line.object['b']}</p>`
            }
            else if (line.object['type'] == LineTypeEnum.SLANTED) {
                lines_html_string += `<p>y = ${line.object['a']}x + ${line.object['b']}</p>`
            }
            lines_html_string += `<p>included points = {${line.object['pointsOn'].map((id) => pointNames[newPointNames[id]])}}</p><br>`;
        }
    }

    let circles_html_string = "";
    if (data['circles'] != null) {
        for (var circle of data['circles']) {
            circles_html_string += `
                <h4>ID = ${circle['ID']}:</h4> 
                <p>id = ${circle.object['id']}</p>
                <p>center id = ${circle.object['centerId']}(${pointNames[newPointNames[circle.object['centerId']]]})<p>
                <p>equation (x - ${circle.object['centerX']})^2 + (y - ${circle.object['centerY']})^2 = ${circle.object['radius']}^2
                </p> <p>included points = {${circle.object['pointsOn'].map((id) => pointNames[newPointNames[id]])}}</p><br>
                `
        }
    }

    let basic_info = '<h2>P O I N T S</h2>' + points_html_string +
        '<br> <h2>L I N E S</h2>' + lines_html_string +
        '<br> <h2>C I R C L E S</h2>' + circles_html_string;
    
    let extended_info = `<h2>I N T E R S E C T I O N S<h2>`;

    let intersection_points = data['intersections']
    let line_line = intersection_points['line_line'];
    let circle_cirlce = intersection_points['circle_circle'];
    let line_circle = intersection_points['line_circle'];

    let linesNumber = line_line.length;
    let circlesNumber = circle_cirlce.length;

    extended_info += '<h3>O F _ L I N E _ A N D _ L I N E</h3> <table class = "ip"><tr class = "ipe"> <th class = "ipe"></th>';
    for (let i = 0; i < linesNumber; i++) {
        extended_info += `<th class = "ipe">${i}</th>`;
    }
    extended_info += '</tr>';

    for (let i = 0; i < linesNumber; i++) {
        extended_info += '<tr class = "ipe">';
        extended_info += `<th class = "ipe">${i}</th>`;
        for (let j = 0; j < line_line[i].length; j++) {
            extended_info += `<th class = "ipe">${line_line[i][j].map((id) => pointNames[newPointNames[id]])}</th>`;
        }
        extended_info += '</tr>';
    }
    extended_info += '</table> <br>';

    extended_info += '<h3>O F _ C I R C L E _ A N D _ C I R C L E</h3> <table class = "ip"><tr class = "ipe"> <th class = "ipe"></th>';
    for (let i = 0; i < circlesNumber; i++) {
        extended_info += `<th class = "ipe">${i}</th>`;
    }
    extended_info += '</tr>';

    for (let i = 0; i < circlesNumber; i++) {
        extended_info += '<tr class = "ipe">';
        extended_info += `<th class = "ipe">${i}</th>`;
        for (let j = 0; j < circlesNumber; j++) {
            extended_info += `<th class = "ipe">${circle_cirlce[i][j].map((id) => pointNames[newPointNames[id]])}</th>`;
        }
        extended_info += '</tr>';
    }
    extended_info += '</table> <br>';

    extended_info += '<h3>O F _ L I N E _ A N D _ C I R C L E</h3> <table class = "ip"><tr class = "ipe"> <th class = "ipe"></th>';
    for (let i = 0; i < linesNumber; i++) {
        extended_info += `<th class = "ipe">${i}</th>`;
    }
    extended_info += '</tr>';

    for (let i = 0; i < circlesNumber; i++) {
        extended_info += '<tr class = "ipe">';
        extended_info += `<th class = "ipe">${i}</th>`;
        for (let j = 0; j < linesNumber; j++) {
            extended_info += `<th class = "ipe">${line_circle[j][i].map((id) => pointNames[newPointNames[id]])}</th>`;
        }
        extended_info += '</tr>';
    }
    extended_info += '</table> <br>';

    extended_info += '<h2>S H A P E S _ O N _ W H I C H _ L I E S _ I N T E R S E C T I O N _ P O I N T S</h2>'
    
    let points_on_line_line = intersection_points['points_on_line_line']
    let points_on_circle_circle = intersection_points['points_on_circle_circle']
    let points_on_line_circle = intersection_points['points_on_line_circle']

    let k = points_on_line_line.length;
    
    extended_info += '<table class = "ip"><tr class = "ipe"> <th class = "ipe"></th>'
    extended_info += '<th class = "ipe">line - line</th><th class = "ipe">circle - circle</th><th class = "ipe">line - circle</th></tr>'

    for(let i = 0; i<k; i++) {
        extended_info += `<th class = "ipe">${i}(${pointNames[newPointNames[i]]})</th>
                          <th class = "ipe">${points_on_line_line[i].map((pair) => "<" + pair + ">")}</th>
                          <th class = "ipe">${points_on_circle_circle[i].map((pair) => "<" + pair + ">")}</th>
                          <th class = "ipe">${points_on_line_circle[i].map((pair) => "<" + pair + ">")}</th></tr>`
    }

    extended_info += '</table> <br>';
    
    extended_info += '<h2>D E P E N D E N C I E S</h2>';

    for (var group of data['dependencies']) {
        if (group['dependencies'] == null) {
            continue;
        }
        
        extended_info += `<h3>${DependencyTypeEnum[group.type]}</h3>`;

        for (var dependency of group.dependencies) {
            extended_info += `<p>dependency ID = ${dependency.id}: `

            switch(dependency.category) {
                case DependencyCategoryEnum.FORMULA:
                    switch(dependency.type) {
                        case DependencyTypeEnum.SEGMENT_LENGTH:
                            dependency = <DependencyRecord<Formula, Formula>> dependency;
                            //extended_info += `${createSegmentName(dependency.object1.end1Id, dependency.object1.end2Id)} and ${dependency.object2.variableName} = ${dependency.object2.value}`
                            extended_info += `${dependency.object1.value} = ${dependency.object2.value}`;
                            break;
                        case DependencyTypeEnum.ANGLE_VALUE:
                            dependency = <DependencyRecord<Formula, Formula>> dependency;
                            //extended_info += `${createAngleName(dependency.object1.point1Id, dependency.object1.vertexId, dependency.object1.point2Id, dependency.object1.type)} and ${dependency.object2.variableName} = ${dependency.object2.value}`
                            extended_info += `${dependency.object1.value.replace("<", "&lt")} = ${dependency.object2.value.replace("<", "&lt")}`;
                            break;
                        case DependencyTypeEnum.EQUATION:
                            dependency = <DependencyRecord<Formula, Formula>> dependency;
                            extended_info += `${dependency.object1.value.replace("<", "&lt")} = ${dependency.object2.value.replace("<", "&lt")}`;
                            break;
                    default:
                            alert("NIEUWZGLEDNIONA MOZLIWOSC!");
                            break;
                    }
                    break;
                case DependencyCategoryEnum.POLYGON_TYPE:
                    dependency = <DependencyRecord<IdHolder, PolygonModel>> dependency;
                    extended_info += `${createPolygonName(dependency.object2.verticesIds)} is ${PolygonTypeEnum[dependency.object1.id]}`
                    break;
                case DependencyCategoryEnum.OF_POINTS_PAIRS:
                    dependency = <DependencyRecord<PointsPairModel, PointsPairModel>> dependency;
                    extended_info += `${createSegmentName(dependency.object1.end1Id, dependency.object1.end2Id)} and ${createSegmentName(dependency.object2.end1Id, dependency.object2.end2Id)}`
                    break;
                case DependencyCategoryEnum.OF_LINES:
                    dependency = <DependencyRecord<IdHolder, IdHolder>> dependency;
                    extended_info += `${createLineName(dependency.object1.id)} and ${createLineName(dependency.object2.id)}`
                    break;
                case DependencyCategoryEnum.OF_CIRCLES:
                    dependency = <DependencyRecord<IdHolder, IdHolder>> dependency;
                    extended_info += `${createCircleName(dependency.object1.id)} and ${createCircleName(dependency.object2.id)}`
                    break;
                case DependencyCategoryEnum.OF_ANGLES:
                    dependency = <DependencyRecord<AngleModel, AngleModel>> dependency;
                    extended_info += `${createAngleName(dependency.object1.point1Id, dependency.object1.vertexId, dependency.object1.point2Id, dependency.object1.type)} and ${createAngleName(dependency.object2.point1Id, dependency.object2.vertexId, dependency.object2.point2Id, dependency.object2.type)}`
                    break;
                case DependencyCategoryEnum.OF_LINE_AND_ANGLE:
                    dependency = <DependencyRecord<IdHolder, AngleModel>> dependency;
                    extended_info += `${createLineName(dependency.object1.id)} and ${createAngleName(dependency.object2.point1Id, dependency.object2.vertexId, dependency.object2.point2Id, dependency.object2.type)}`
                    break;
                case DependencyCategoryEnum.OF_LINE_AND_CIRCLE:
                    dependency = <DependencyRecord<IdHolder, IdHolder>> dependency;
                    extended_info += `${createLineName(dependency.object1.id)} and ${createCircleName(dependency.object2.id)}`
                    break;
                case DependencyCategoryEnum.OF_LINE_AND_POINTS_PAIR:
                    dependency = <DependencyRecord<IdHolder, PointsPairModel>> dependency;
                    extended_info += `${createLineName(dependency.object1.id)} and ${createSegmentName(dependency.object2.end1Id, dependency.object2.end2Id)}`
                    break;
                case DependencyCategoryEnum.OF_CIRCLE_AND_POLYGON:
                    dependency = <DependencyRecord<IdHolder, PolygonModel>> dependency;
                    extended_info += `${createCircleName(dependency.object1.id)} and ${createPolygonName(dependency.object2.verticesIds)}`
                    break;
                case DependencyCategoryEnum.OF_POINTS_PAIRS_PAIR_AND_POINTS_PAIR:
                    dependency = <DependencyRecord<ModelsPairModel<PointsPairModel>, PointsPairModel>> dependency;
                    extended_info += `${createSegmentName(dependency.object1.first.end1Id, dependency.object1.first.end2Id)} with ${createSegmentName(dependency.object1.second.end1Id, dependency.object1.second.end2Id)} and ${createSegmentName(dependency.object2.end1Id, dependency.object2.end2Id)}`
                    break;
                case DependencyCategoryEnum.OF_POLYGONS:
                    dependency = <DependencyRecord<PolygonModel, PolygonModel>> dependency;
                    extended_info += `${createPolygonName(dependency.object1.verticesIds)} and ${createPolygonName(dependency.object2.verticesIds)}`
                    break;
                default:
                    alert("NIEUWZGLEDNIONA MOZLIWOSC!!!");
                    break;
            }

            extended_info += `, because ${DependencyReasonEnum[dependency.reason]} and based on {${dependency.basedOn}}; usefullness = ${UsefullnessLevel[dependency.usefullness]}</p>`
        }

        extended_info += `<br>`
    }

    let result_html = `
        <html>
        <head>
            <style>
                table { width: 100%; }
                th { text-align: left; font-weight: normal;}
                tr { vertical-align: top; font-weight: normal; }

                .ip { width:100% table-layout:fixed; overflow: hidden; border: 1px solid black; border-collapse: collapse;}
                .ipe { border: 1px solid black; border-collapse: collapse; text-align: center;}

            </style>
        </head>
        <body>
            <table>
                <tr>
                    <th>` + basic_info + `</th>
                    <th>` + extended_info + `</th>
                </tr>
            </table>
        </body>
        </html>
    `;

    return result_html;
}