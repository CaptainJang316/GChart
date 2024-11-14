export type Option = {
    type: string;
    data: Data[];
    layout: Layout;
    chartStyle: ChartStyle;
    xxAxis?: XAxis;
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
    showSplitLine?: boolean;
    axisLabel?: {
        rotate: number;
    },
}

type YAxis = {
    min?: number;
    max?: number;
    axisLabel?: {
        formatter: string;
    }
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