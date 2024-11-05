/* eslint-disable */
import { useMemo } from 'react';

interface GridProps {
    scales: {
        xScale: any;
        yScale: any;
    },
    width: number,
    height: number
    horizontalLineCnt: number;
}

export const useGrid = ({scales, width, height, horizontalLineCnt}: GridProps) => {
    const gridLines = useMemo(() => {
        const vertical = scales.xScale.ticks(5).map((tick: number) => ({
            id: `x-${tick}`,
            x1: scales.xScale(tick) * width,
            y1: 0,
            x2: scales.xScale(tick) * width,
            y2: height,
        }));

        const horizontal = scales.yScale.ticks(horizontalLineCnt).map((tick: number) => ({
            id: `y-${tick}`,
            x1: 25,
            y1: scales.yScale(tick),
            x2: width,
            y2: scales.yScale(tick) * height
        }));

        return {vertical, horizontal};
    }, [scales, width, height]);

    return { gridLines };
}