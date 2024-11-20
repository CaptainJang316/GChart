export interface Option {
    type: string;
    data: Data[];
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

export interface BarChartProps {
    onLayoutChange?: (layout: Option['layout']) => void;
    onChartStyleChange?: (style: Option['chartStyle']) => void;
    onTitleChange?: (title: Option['title']) => void;
    onAxisChange?: (axis: Option['axis']) => void;
    onLabelChange?: (label: Option['label']) => void;
}

export type SingleBarData = {
    label: string;
    value: number;
}

export type MultiBarData = {
    label: string;
    value: 
    ;
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
    color: string;
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