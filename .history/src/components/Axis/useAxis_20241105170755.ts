/* eslint-disable */
import { useMemo } from 'react';
import { max, scaleLinear } from 'd3';

interface AxisProps {
    data: number[];
    width: number;
    height: number;
    axisCnt: number;
}

// function getBoundValue(maxValue: number): number {
//     const boundValue = maxValue + 100; 
//     const highestPlaceValue = Math.pow(10, Math.floor(Math.log10(num))); // 가장 높은 자릿수의 자리수 계산
//     return Math.floor(num / highestPlaceValue) * highestPlaceValue; // 가장 높은 자릿수 제외한 나머지 0으로 만들기
// }

// Custom Hook 정의
export const useAxis = ({data, width, height, axisCnt = 6}: AxisProps) => {
    const scales = useMemo(() => {
        const xScale = scaleLinear()
        .domain([0, data.length - 1]) // 입력 범위: 예를 들어, 데이터 값이 0에서 100 사이에 있음
        .range([0, width]); // 출력 범위: 예를 들어, 픽셀로 나타낼 때 0에서 500 사이로 매핑
        

        const maxValue = Math.max(...data);

        const yScale = scaleLinear()
        .domain([0, maxValue])
        .range([maxValue * 1.3, 0]);

        return {xScale, yScale};
    }, [data, width, height]);

    const xAxis = useMemo(() => {
        const ticks = scales.xScale.ticks(data.length - 1);
        console.log("ticks: " + ticks);
        return {
            ticks: ticks.map(tick => ({
                value: tick,
                position: scales.xScale(tick) * width 
            }))
        };
    }, [scales.xScale]);

    const yAxis = useMemo(() => {
        const ticks = scales.yScale.ticks(axisCnt);
        console.log("ticks: " + ticks);
        return {
            ticks: ticks.map(tick => ({
                value: Math.round(num / 10) * 10tick * 1.3,
                position: scales.yScale(tick)
            }))
        }
    }, [scales.yScale]);

    return { xAxis, yAxis, scales }; // <-- scales도 쓸 일이 있나?
}