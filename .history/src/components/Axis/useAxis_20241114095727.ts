/* eslint-disable */
import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';

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

    const calculateOptimalTickCount = (minY: number, maxY: number) => {
        // 1. 전체 범위 계산
        const range = maxY - minY;
        
        // 2. 적절한 간격 찾기 (앞서 사용한 niceIntervals 활용)
        const niceIntervals = [1, 2, 5, 10, 20, 25, 50, 75, 100, 125, 150, 175, 200, 250, 500, 1000, 1500, 2000];
        const roughInterval = range / 6; // 기본값 6을 기준으로 시작
        const niceInterval = niceIntervals.find(item => item >= roughInterval) || 
            niceIntervals[niceIntervals.length - 1];
        
        // 3. 최적의 눈금 개수 계산
        const optimalTickCount = Math.ceil(range / niceInterval);
        
        // 4. 눈금 개수 범위 제한 (너무 많거나 적지 않도록)
        const MIN_TICKS = 4;
        const MAX_TICKS = 10;
        
        if (optimalTickCount < MIN_TICKS) {
            return MIN_TICKS;
        } else if (optimalTickCount > MAX_TICKS) {
            return MAX_TICKS;
        }
        
        return optimalTickCount;
    };


    const scales = useMemo(() => {
        // X축 스케일 설정
        const xScale = scaleLinear() // <-- 이거 좀 이상함... 틀릴 듯...?
            .domain([0, data.length - 1])
            .range([horizontalPadding, width - horizontalPadding]);

        // Y축 스케일 설정
        const maxValue = Math.max(...data);
        const maxY  = findAppropriateMaxY(maxValue);
        const minY = findAppropriateMinY(minValue);
        
        console.log("minY: " + minY);
        const yScale = scaleLinear()
            .domain([minY, maxY])
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
        const tickC
        const ticks = scales.yScale.ticks(6);
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