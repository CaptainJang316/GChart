export type Option = {
    type: string;
    data: Data[];
    width?: number;
    height?: number;
    axisCnt?: number;
    color?: string;
    title?: Title;
}

type Data = {
    label: string;
    value: number;
}

type Title = {
    text: string;
    subTitle: string;
}