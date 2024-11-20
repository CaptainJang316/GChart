interface type Option = {
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

export type Data = {
    label: string;
    value: number;
}

export type TitleAlign = 'start' | 'middle' | 'end';

export type Title = {
    text: string;
    subTitle?: string;
    titleAlign?: TitleAlign;
}

export type Layout = {
    width: number;
    height: number;
    padding?: number;
    axisCnt?: number;
}

export type XAxis = {
    boundaryGap?: boolean;
    showSplitLine?: boolean;
    axisLabel?: {
        rotate: number;
    },
}

export type YAxis = {
    min?: number;
    max?: number;
    fontSize?: number;
    color?: string;
    formatter?: string;
}

export type ChartStyle = {
    color: string;
    hoverColor?: string;
    animation?: string;
    unit?: string;
    fillArea?: boolean;
}

export type Label = {
    show: boolean,
    fontSize?: number,
    position?: string
}