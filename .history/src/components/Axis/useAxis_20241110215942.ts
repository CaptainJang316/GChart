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
    const scales = useMemo(() => {
        // X축 스케일 설정
        const xScale = scaleLinear() // <-- 이거 좀 이상함... 틀릴 듯...?
            .domain([0, data.length - 1])
            .range([horizontalPadding, width - horizontalPadding]);

        // Y축 스케일 설정
        const maxValue = Math.max(...data);
        const yMaxValue = getAppropriateMaxValue(maxValue);
        
        const yScale = scaleLinear()
            .domain([0, yMaxValue])
            // 위쪽 패딩만 적용하고 아래쪽은 height 값 그대로 사용
            .range([height, topPadding]); // -1을 해서 baseline에 정확히 맞춤

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
        let ticks = scales.yScale.ticks(axisCnt);

        while() {

        }
        if(ticks[ticks.length - 1] < topPadding) {

        }

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
    const roundedMax = Math.ceil((maxValue * 1.1) / order) * order; // 1.1 배수로 여유 추가
    return roundedMax;
};