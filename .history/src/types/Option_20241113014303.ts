export type Option = {
    type: string;
    data: Data[];
    layout: Layout;
    style: Style;
    title?: Title;
    tooltip?: boolean;
    label?: Label;
}

type Data = {
    label: string;
    value: number;
}

type Title = {
    text: string;
    subTitle?: string;
    titleAlign?: string;
}

type Layout = {
    width: number;
    height: number;
    padding?: number;
    axisCnt?: number;
}

type Style = {
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