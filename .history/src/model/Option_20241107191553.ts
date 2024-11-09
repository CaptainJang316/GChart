export type Option = {
    type: string;
    data: Data[];
    width?: number;
    height?: number;
    axisCnt?: number;
    color?: string;
    title?: 
}

type Data = {
    label: string;
    value: number;
}