/* eslint-disable */
import { useMemo } from 'react';
import { scaleLinear, scalePoint } from 'd3-scale';

interface AxisProps {
    data: number[];
    width: number;
    height: number;
    axisCnt?: number;
    horizontalPadding?: number; // 좌우 패딩
    topPadding?: number; // 위쪽 패딩
}

interface AxisProps {
    data: number[];
    width: number;
    height: number;
    axisCnt?: number;
    horizontalPadding?: number;
    topPadding?: number;
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
        const niceIntervals = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
        const roughInterval = maxDataValue / (axisCnt - 1);
        
        let niceInterval = niceIntervals.find(i => i >= roughInterval) || 
            niceIntervals[niceIntervals.length - 1];
        
        let maxTick = Math.ceil(maxDataValue / niceInterval) * niceInterval;
        
        const ratio = maxTick / maxDataValue;
        
        if (ratio > 1.5) {
            const index = niceIntervals.indexOf(niceInterval);
            if (index > 0) {
                niceInterval = niceIntervals[index - 1];
                maxTick = Math.ceil(maxDataValue / niceInterval) * niceInterval;
            }
        }
        
        return maxTick;
    };

    const scales = useMemo(() => {
        // X축 스케일 설정 - 카테고리형 데이터에 더 적합한 방식으로 변경
        const xScale = scalePoint()
            .domain(data.map((_, i) => i.toString()))
            .range([horizontalPadding, width - horizontalPadding])
            .padding(0.5);

        // Y축 스케일 설정
        const maxValue = Math.max(...data);
        const appropriateMaxY = findAppropriateMaxY(maxValue);
        
        const yScale = scaleLinear()
            .domain([0, appropriateMaxY])
            .range([height - topPadding, topPadding]) // Y축 방향 수정
            .nice(); // 깔끔한 눈금 값을 위해 nice() 추가

        return { xScale, yScale };
    }, [data, width, height, horizontalPadding, topPadding, findAppropriateMaxY]);

    const xAxis = useMemo(() => {
        return {
            ticks: data.map((_, index) => ({
                value: index,
                position: scales.xScale(index.toString()) ?? 0
            }))
        };
    }, [scales.xScale, data]);

    const yAxis = useMemo(() => {
        // 적절한 간격으로 눈금 생성
        const maxDomain = scales.yScale.domain()[1];
        const interval = maxDomain / (axisCnt - 1);
        const ticks = Array.from(
            { length: axisCnt }, 
            (_, i) => Math.round(i * interval * 100) / 100
        );

        return {
            ticks: ticks.map(tick => ({
                value: tick,
                position: scales.yScale(tick),
                // 포맷팅 함수 추가
                // formatted: formatTickValue(tick)
            }))
        };
    }, [scales.yScale, axisCnt]);

    // // 틱 값 포맷팅을 위한 헬퍼 함수
    // const formatTickValue = (value: number) => {
    //     if (value >= 1000000) {
    //         return `${(value / 1000000).toFixed(1)}M`;
    //     }
    //     if (value >= 1000) {
    //         return `${(value / 1000).toFixed(1)}K`;
    //     }
    //     return value.toLocaleString();
    // };

    return { 
        xAxis, 
        yAxis, 
        scales,
        // 추가적인 유틸리티 함수들
        // utils: {
        //     formatTickValue
        // }
    };
};