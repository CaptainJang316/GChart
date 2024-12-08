export interface Option {
    type: string;
    data: SingleBarData | MultiBarData | LineData;
    layout: Layout;
    chartStyle: ChartStyle;
    axis?: {
        xAxis?: XAxis;
        yAxis?: YAxis;
    }
    title?: Title;
    tooltip?: boolean;
    label?: Label;
}

export interface SingleBarChartProps extends Option {
    data: SingleBarData;
}

export interface MultiBarChartProps extends Option {
    data: MultiBarData;
}

export interface LineChartProps extends Option {
    data: LineData;
}

export type SingleBarData = {
    xLabel: string[];
    value: number[];
}

export type MultiBarData = {
    xLabel: string[];
    data: MultiData[];
}

export type LineData = {
    xLabel: string[];
    data: MultiData[];
}

export type MultiData = {
    name?: string;
    value: number[];
}

export type TitleAlign = 'start' | 'middle' | 'end';

export interface Title {
    text: string;
    subTitle?: string;
    titleAlign?: TitleAlign;
}

export interface Layout {
    width: number;
    height: number;
    padding?: number;
    axisCnt?: number;
}

export interface XAxis {
    boundaryGap?: boolean;
    showSplitLine?: boolean;
    axisLabel?: {
        rotate: number;
    },
}

export interface YAxis {
    min?: number;
    max?: number;
    fontSize?: number;
    color?: string;
    formatter?: string;
}

export interface ChartStyle {
    color?: string;
    hoverColor?: string;
    animation?: string;
    unit?: string;
    fillArea?: boolean;
}

export interface Label {
    show: boolean,
    fontSize?: number,
    position?: string
}