/* eslint-disable */
import React from 'react';
import { useAxis } from '../Axis/useAxis';
import { useGrid } from '../Grid/useGrid';

interface ChartProps {
    data: { label: string, value: number }[];
    width?: number;
    height?: number;
    axisCnt?: number;
    color?: string;
};

const LineChart: React.FC<ChartProps> = ({
    data,
    width = 800,
    height = 500,
    axisCnt = 8,
    color = '#4A90E2',
}) => {
    const values = data.map(item => item.value);
    const {xAxis, yAxis, scales} = useAxis({data: values, width: width, height: height, axisCnt: axisCnt});
    const {gridLines} = useGrid({scales, width, height, horizontalLineCnt: axisCnt});

    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = (width - 30) / data.length;
    // const yTicks = 10;
    // const tickValues = Array.from({ length: yTicks }, (_, i) => (maxValue / yTicks) * i);

    return (
        // svg 요소 안에, 차트를 그린다.
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height + 20}`} style={{ border: '1px solid #ccc', padding: '1rem 1.5rem 1.5rem 1rem'}}>
            <g className='grid-layer'>
                {gridLines.horizontal.map((el: { id: React.Key | null | undefined; x1: string | number | undefined; y1: string | number | undefined; x2: string | number | undefined; y2: string | number | undefined; }, index: number) => (
                    <line
                        key={el.id}
                        x1={el.x1}
                        y1={el.y1}
                        x2={el.x2}
                        y2={el.y2}
                        stroke="#e0e0e0"
                        // strokeDasharray="4 4"
                        strokeWidth={1}
                    />
                ))}
            </g>

            <g className='axis-layer'>
                {yAxis.ticks.map((tick) => (
                    <text
                        x={10}
                        y={tick.position}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#333"
                    >
                    {tick.value}
                    </text>
                ))}
            </g>
            
            <g className='chart-layer' style={{ marginLeft: '1rem' }}>
                {data.map((d, i) => {
                    const barHeight = height - scales.yScale(d.value);
                    return (
                        // g는 svg 요소 내에 사용되는 것.
                        // svg에서 그룹을 만드는 역할을 한다.
                        // trangform은 그룹의 위치를 변환하는 데 사용됨.
                        // translate(${i * barWidth}, ${height - barHeight}) <- x축, y축 이동 정도 지정
                        
                        <g key={i} transform={`translate(${i * barWidth}, ${height - barHeight})`}>
                            <rect
                                width={barWidth - 10}
                                height={barHeight}
                                fill={color}
                                x={30}
                                y={0}
                            />
                            <text
                                x={barWidth / 2 + 25}
                                y={-5}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#333"
                            >
                                {d.value}
                            </text>
                        </g>
                    );
                })}
            </g>

            <g className='bottom-layer'>
                <line
                    x1={25}
                    y1={height}
                    x2={width}
                    y2={height}
                    stroke="black"
                    // strokeDasharray="4 4"
                    strokeWidth={2}
                />
            </g>
            <g className='label-layer'>
                {data.map((d, i) => {
                    let currX = barWidth * i;
                    return (
                        <text
                        x={currX + barWidth / 2 + 25}
                        y={height + 17}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#333"
                    >
                        {d.label}
                    </text>
                    );
                })}
            </g>
        </svg>
    );
};

export default LineChart;