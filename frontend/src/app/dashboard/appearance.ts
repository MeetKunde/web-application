export class Appearance {
    /** Constant variable representing color in HEX of drawn shapes. */
    public static basicShapesColor = "#2C3C5B";

    /** Constant variable representing shape color in HEX after mouseover on shape. */
    public static mouseoverShapesColor = "#0AC5A8";

    /** Constant variable representing color in HEX of prompting shapes. */
    public static promptingShapesColor = "#ADADAD";

    /** Constant variable representing color in HEX of acivated shape. Shape is activated when was chosen in {@link ComplexShapeCreator}. */
    public static activatedShapesColor = "#0AC5A8";

    /** Constant variable representing color in HEX of guide lines. */
    public static guideLinesColor = "#ADADAD";

    /** Constant variable representing radius of point. */
    public static pointRadius = 3;

    /** Constant variable representing point radius after mouseover on point. */
    public static mouseoverPointRadius = 5;

    /** Constant variable representing hit stroke width of point. */
    public static pointHitStrokeWidth = 6;

    /** Constant variable representing radius of activated point. */
    public static activatedPointRadius = 4;

    /** Constant variable representing stroke width of line. */
    public static linesStrokeWidth = 2;

    /** Constant variable representing line stroke width after mouseover on line. */
    public static mouseoverLinesStrokeWidth = 5;

    /** Constant variable representing hit stroke width of line. */
    public static linesHitStrokeWidth = 6;

    /** Constant variable representing stroke width of activated line. */
    public static activatedLinesStrokeWidth = 4;

    /** Constant variable representing stroke width of guide line. */
    public static guideLinesStrokeWidth = 2;

    /** Constant variable representing type of line cap. */
    public static linesCap = "round";

    /** Constant variable representing type of line join. */
    public static linesJoin = "round";

    /** Constant variable representing alphabet used in points naming. */
    public static capitalLetters = "ABCDEFGHIJKLMNOPQRSTUWVXYZ";

    /** Constant variable specifying whether the name of the point should appear next to the created points. */
    public static showPointLabels = true;

    /** Constant variable representing text font. */
    public static textFont = "Cambria Math";

    /** Constant variable representing text font style. */
    public static textFontStyle = "normal";

    /** Constant variable representing text color. */
    public static textColor = "#000000";

    /** Constant variable representing text size. */
    public static textSize = 15;

    /** Constant variable representing offset used in finding guide lines. */
    public static guideLineOffset: number = 2;

    public static highlightColors: string[] = [ "#006588", "#00909F", "#00B99A", "#8ADE83", "#F9F871" ];
}