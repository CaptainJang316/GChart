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
}

type Layout = {
    width: number;
    height: number;
    padding?: string;
    axisCnt?: number;
}

type Style = {
    color: string;
    animation?: string;
    unit?: string;
}

type Label = {
    show: boolean,
    fontSize?: number,
    position?: string
}