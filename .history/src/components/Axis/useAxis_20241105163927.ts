/* eslint-disable */
import { useMemo } from 'react';
import { scaleLinear } from 'd3';

interface AxisProps {
    data: number[];
    width: number;
    height: number;
    axisCnt: number;
}

// Custom Hook 정의
export const useAxis = ({data, width, height, axisCnt = 6}: AxisProps) => {
    const scales = useMemo(() => {
        const xScale = scaleLinear()
        .domain([0, data.length - 1]) // 입력 범위: 예를 들어, 데이터 값이 0에서 100 사이에 있음
        .range([0, width]); // 출력 범위: 예를 들어, 픽셀로 나타낼 때 0에서 500 사이로 매핑
        

        const 

        const yScale = scaleLinear()
        .domain([0, Math.max(...data)])
        .domain([Math.max(...data) * 1.2, 0]);

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
                value: tick,
                position: scales.yScale(tick) * height 
            }))
        }
    }, [scales.yScale]);

    return { xAxis, yAxis, scales }; // <-- scales도 쓸 일이 있나?
}