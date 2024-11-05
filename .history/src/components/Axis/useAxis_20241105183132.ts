/* eslint-disable */
import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';

interface AxisProps {
    data: number[];
    width: number;
    height: number;
    axisCnt?: number;
    padding?: number; // 차트 여백을 위한 패딩 값
}

export const useAxis = ({ 
    data, 
    width, 
    height, 
    axisCnt = 6,
    padding = 40 
}: AxisProps) => {
    const scales = useMemo(() => {
        // X축 스케일 설정
        const xScale = scaleLinear()
            .domain([0, data.length - 1])
            // 패딩을 고려한 실제 그래프 영역 계산
            .range([padding, width - padding]);

        // Y축 스케일 설정
        const maxValue = Math.max(...data);
        const yMaxValue = getAppropriateMaxValue(maxValue);
        
        const yScale = scaleLinear()
            .domain([0, yMaxValue])
            // 위아래 여백을 고려한 높이 설정
            .range([height - padding, padding]);

        return { xScale, yScale };
    }, [data, width, height, padding]);

    const xAxis = useMemo(() => {
        // 데이터 포인트 수만큼의 눈금 생성
        return {
            ticks: data.map((_, index) => ({
                value: index,
                position: scales.xScale(index)
            }))
        };
    }, [scales.xScale, data]);

    const yAxis = useMemo(() => {
        // y축 눈금 생성
        const ticks = scales.yScale.ticks(axisCnt);
        return {
            ticks: ticks.map(tick => ({
                value: tick,
                position: scales.yScale(tick)
            }))
        };
    }, [scales.yScale, axisCnt]);

    return { xAxis, yAxis, scales };
};

// 적절한 최대값을 계산하는 헬퍼 함수
function getAppropriateMaxValue(maxValue: number): number {
    // 10의 거듭제곱 단위 찾기
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    // 적절한 간격 찾기
    const normalized = maxValue / magnitude;
    
    // 올림하여 깔끔한 최대값 설정
    if (normalized <= 1) return magnitude;
    if (normalized <= 2) return 2 * magnitude;
    if (normalized <= 5) return 5 * magnitude;
    return 10 * magnitude;
}