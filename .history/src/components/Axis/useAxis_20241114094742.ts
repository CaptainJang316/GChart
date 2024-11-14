/* eslint-disable */
import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { min } from 'd3';

interface AxisProps {
    data: number[];
    width: number;
    height: number;
    minValue?: number;
    maxValue?: number;
    horizontalPadding?: number; // 좌우 패딩
    topPadding?: number; // 위쪽 패딩
}

export const useAxis = ({ 
    data, 
    width, 
    height, 
    minValue = 0,
    maxValue = 0,
    horizontalPadding = 30,
    topPadding = 70
}: AxisProps) => {
    // 적절한 Y축 최대값을 찾는 함수
    const findAppropriateMaxY = (maxDataValue: number) => {
        const niceIntervals = [1, 2, 5, 10, 20, 25, 50, 75, 100, 125, 150, 175, 200, 250, 500, 1000, 1500, 2000];
        let dataTerm;
        if(maxValue >= maxDataValue) {
            dataTerm = maxValue - minValue;
        } else dataTerm = maxDataValue - minValue;
        
        const roughInterval = dataTerm/ (6);
        
        let niceInterval = niceIntervals.find(item => item >= roughInterval) || 
            niceIntervals[niceIntervals.length - 1];
        
        let maxTick = Math.ceil(dataTerm / niceInterval) * niceInterval;
        
        const ratio = maxTick / dataTerm;
        
        if (ratio > 1.4) {
            const index = niceIntervals.indexOf(niceInterval);
            if (index > 0) {
                niceInterval = niceIntervals[index - 1];
                maxTick = Math.ceil(dataTerm / niceInterval) * niceInterval;
            }
        }
        
        return maxTick;
    };

    const findAppropriateMinY = (minDataValue: number) => {
        const niceIntervals = [1, 2, 5, 10, 20, 25, 50, 75, 100, 125, 150, 175, 200, 250, 500, 1000, 1500, 2000];
        
        // 데이터가 음수인 경우를 고려
        if (minDataValue >= 0) {
            // 0보다 큰 경우, 가능한 0에 가깝게 설정
            const roughInterval = minDataValue / 6;
            let niceInterval = niceIntervals.find(item => item >= roughInterval) || 
                niceIntervals[niceIntervals.length - 1];
                
            let minTick = Math.floor(minDataValue / niceInterval) * niceInterval;
            
            // 데이터가 0에 가깝다면 0을 반환
            if (minDataValue < niceInterval) {
                return 0;
            }
            
            // 간격이 너무 크면 한 단계 작은 간격 사용
            const ratio = Math.abs((minDataValue - minTick) / minDataValue);
            if (ratio > 0.4) {
                const index = niceIntervals.indexOf(niceInterval);
                if (index > 0) {
                    niceInterval = niceIntervals[index - 1];
                    minTick = Math.floor(minDataValue / niceInterval) * niceInterval;
                }
            }
            
            return minTick;
        } else {
            // 음수인 경우
            const absMinValue = Math.abs(minDataValue);
            const roughInterval = absMinValue / 6;
            let niceInterval = niceIntervals.find(item => item >= roughInterval) ||
                niceIntervals[niceIntervals.length - 1];
                
            let minTick = -Math.ceil(absMinValue / niceInterval) * niceInterval;
            
            // 간격이 너무 크면 한 단계 작은 간격 사용
            const ratio = Math.abs((minDataValue - minTick) / minDataValue);
            if (ratio > 0.4) {
                const index = niceIntervals.indexOf(niceInterval);
                if (index > 0) {
                    niceInterval = niceIntervals[index - 1];
                    minTick = -Math.ceil(absMinValue / niceInterval) * niceInterval;
                }
            }
            
            return minTick;
        }
    };

    const scales = useMemo(() => {
        // X축 스케일 설정
        const xScale = scaleLinear() // <-- 이거 좀 이상함... 틀릴 듯...?
            .domain([0, data.length - 1])
            .range([horizontalPadding, width - horizontalPadding]);

        // Y축 스케일 설정
        const maxValue = Math.max(...data);
        const appropriateMaxY  = findAppropriateMaxY(maxValue);
        const = findAppropriateMinY(min)
        
        const yScale = scaleLinear()
            .domain([appropriateMinY, appropriateMaxY ])
            .range([height, topPadding]);

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
        const ticks = scales.yScale.ticks(7);
        return {
            ticks: ticks.map(tick => ({
                value: tick,
                position: scales.yScale(tick) + 5
            }))
        };
    }, [scales.yScale, minValue, maxValue]);

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