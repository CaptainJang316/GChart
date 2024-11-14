/* eslint-disable */
import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';

interface AxisProps {
    data: number[];
    width: number;
    height: number;
    axisCnt?: number;
    horizontalPadding?: number; // 좌우 패딩
    topPadding?: number; // 위쪽 패딩
}

export const useAxis = ({ 
    data, 
    width, 
    height, 
    axisCnt = 6,
    horizontalPadding = 30,
    topPadding = 15
}: AxisProps) => {
    // 적절한 Y축 최대값을 찾는 함수
    const findAppropriateMaxY = (maxDataValue: number) => {
        const niceIntervals = [1, 2, 5, 10, 20, 25, 50, 75, 100, 125, 150, 175, 200, 250, 500, 1000, 1500, 2000];
        const roughInterval = maxDataValue / (axisCnt - 1);
        
        let niceInterval = niceIntervals.find(item => item >= roughInterval) || 
            niceIntervals[niceIntervals.length - 1];
        
        let maxTick = Math.ceil(maxDataValue / niceInterval) * niceInterval;
        
        const ratio = maxTick / maxDataValue;
        
        if (ratio > 1.4) {
            const index = niceIntervals.indexOf(niceInterval);
            if (index > 0) {
                niceInterval = niceIntervals[index - 1];
                maxTick = Math.ceil(maxDataValue / niceInterval) * niceInterval;
            }
        }
        
        return maxTick;
    };

    const scales = useMemo(() => {
        // X축 스케일 설정
        const xScale = scaleLinear() // <-- 이거 좀 이상함... 틀릴 듯...?
            .domain([0, data.length - 1])
            .range([horizontalPadding, width - horizontalPadding]);

        // Y축 스케일 설정
        const maxValue = Math.max(...data);
        const appropriateMaxY  = findAppropriateMaxY(maxValue);
        
        const yScale = scaleLinear()
            .domain([0, appropriateMaxY ])
            .range([height, topPadding + 50]);

        return { xScale, yScale };
    }, [data, width, height, horizontalPadding, topPadding]);

    const xAxis = useMemo(() => {
        return {
            ticks: data.map((_, index) => ({
                value: index,
                position: scales.xScale(index)
            }))
        };
    }, [scales.xScale, data]);

    const yAxis = useMemo(() => {
        const ticks = scales.yScale.ticks(axisCnt);
        return {
            ticks: ticks.map(tick => ({
                value: tick,
                position: scales.yScale(tick) + 5
            }))
        };
    }, [scales.yScale, axisCnt]);

    return { xAxis, yAxis, scales };
};

// 적절한 최대값을 계산하는 헬퍼 함수
// function getAppropriateMaxValue(maxValue: number): number {
//     const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
//     const normalized = maxValue / magnitude;
    
//     if (normalized <= 1) return magnitude;
//     if (normalized <= 2) return 2 * magnitude;
//     if (normalized <= 5) return 5 * magnitude;
//     return 10 * magnitude;
// }

export const getAppropriateMaxValue = (maxValue: number): number => {
    const order = Math.pow(10, Math.floor(Math.log10(maxValue)));
    let roundedMax = Math.ceil(maxValue / order) * order;
    // while(roundedMax - maxValue > maxValue / 7) roundedMax -= 30;
    return roundedMax;
};