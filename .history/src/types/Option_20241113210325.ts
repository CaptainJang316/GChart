export type Option = {
    type: string;
    data: Data[];
    layout: Layout;
    chartStyle: ChartStyle;
    xAxis?: XAxis;
    yAxis?: YAxis;
    title?: Title;
    tooltip?: boolean;
    label?: Label;
}

type Data = {
    label: string;
    value: number;
}

type TitleAlign = 'start' | 'middle' | 'end';

type Title = {
    text: string;
    subTitle?: string;
    titleAlign?: TitleAlign;
}

type Layout = {
    width: number;
    height: number;
    padding?: number;
    axisCnt?: number;
}

type XAxis = {
    showSplitLine: boolean;
}

type YAxis = {
    min: number;
    max: 200,
    padding?: number;
    axisCnt?: number;
}

type ChartStyle = {
    color: string;
    hoverColor?: string;
    animation?: string;
    unit?: string;
}

type Label = {
    show: boolean,
    fontSize?: number,
    position?: string
}