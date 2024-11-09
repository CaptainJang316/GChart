export type Option = {
    type: string;
    data: Data[];
    layout: Layout;
    style: Style;
    title?: Title;
    tooltip?: Tooltip;
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
    axisCnt?: number;
}

type Style = {
    color: string;
}

type Style = {
    color: string;
}