/* eslint-disable */
import React, { useState } from 'react';
import { useAxis } from '../Axis/useAxis';
import { useGrid } from '../Grid/useGrid';
import { Option } from '../../types/Option';
import { darkenColor, lightenColor } from '../../utils/color';
import '../../App.css';
import { animated, config, useSpring } from '@react-spring/web';
import styled, { keyframes } from 'styled-components';


const StyledTooltip = styled.div<{ x: number; y: number }>`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  pointer-events: none;
  font-size: 12px;
  transform: translate(-50%, -100%);
  white-space: nowrap;
  z-index: 10000;
`;

const growHeight = (finalHeight: number) => keyframes`
  from {
    height: 0;
    y: ${finalHeight}; // y 값은 아래에서 시작
  }
  to {
    height: ${finalHeight};
  }
`;

const StyledRect = styled.rect<{ finalHeight: number }>`
  animation: ${(props) => growHeight(props.finalHeight)} 0.8s ease-out; 
`

const BarChart: React.FC<Option> = ({
    data,
    title,
    layout: {
        width = 400,
        height = 300,
        padding = 15,
        axisCnt = 5,
    },
    style: {
        color = 'green',
        hoverColor = lightenColor(color, 0.2),
    },
    tooltip = true
}) => {
    const values = data.map(item => item.value);
    const {xAxis, yAxis, scales} = useAxis({data: values, width: width, height: height, axisCnt: axisCnt});
    const {gridLines} = useGrid({data: values, scales, width, height, horizontalLineCnt: axisCnt});
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    // const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = (width - 30) / data.length;
    // const yTicks = 10;
    // const tickValues = Array.from({ length: yTicks }, (_, i) => (maxValue / yTicks) * i);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleMouseMove = (event: React.MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
        console.log({ x: event.clientX, y: event.clientY }); // 좌표 확인용
    };

    return (
        // svg 요소 안에, 차트를 그린다.
        <div style={{ display: 'inline-block', width: `${width}px`, height: `${height}px`}}>
            <svg width='100%' height='100%' viewBox={`0 0 ${width} ${height + 30}`} onMouseMove={handleMouseMove} style={{ border: '1px solid #ccc', padding: `${padding}px`}}>
                {              
                    title? 
                    <g className='title-layer'>
                        <h3>{title.text}</h3>
                        {title.subTitle? <h5>{title.subTitle}</h5> : ''}
                    </g> : ''
                }
                <g className='grid-layer'>
                    {gridLines.horizontal.map((el: { id: React.Key | null | undefined; x1: number ; y1: number ; x2: number ; y2: number; }, index: number) => (
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
                    {gridLines.vertical.map((el: { id: React.Key | null | undefined; x1: number ; y1: number ; x2: number ; y2: number; }, index: number) => (
                        <line
                            key={el.id}
                            x1={barWidth * index + 25}
                            y1={height}
                            x2={barWidth * index + 25}
                            y2={height + 5}
                            stroke="black"
                            // strokeDasharray="4 4"
                            strokeWidth={1}
                        />
                    ))}
                </g>

                <g className='axis-layer'>
                    {yAxis.ticks.map((tick) => (
                        <text
                            x={5}
                            y={tick.position}
                            textAnchor="middle"
                            // fontSize="10"
                            fill="#333"
                        >
                        {tick.value}
                        </text>
                    ))}
                </g>
                
                <g className='chart-layer'>
                    {data.map((d, i) => {
                        const barHeight = height - scales.yScale(d.value);
                        const isHovered = hoveredIndex == i;

                        return (
                            // g는 svg 요소 내에 사용되는 것.
                            // svg에서 그룹을 만드는 역할을 한다.
                            // trangform은 그룹의 위치를 변환하는 데 사용됨.
                            // translate(${i * barWidth}, ${height - barHeight}) <- x축, y축 이동 정도 지정
                            
                            <g key={i} transform={`translate(${i * barWidth}, ${height - barHeight})`}>
                                <StyledRect
                                    width={barWidth - (barWidth / 6)}
                                    height={barHeight}
                                    fill={isHovered? hoverColor : color}
                                    x={barWidth / 12 + 25}
                                    y={0}
                                    finalHeight={barHeight}
                                    onMouseOver={() => setHoveredIndex(i)}
                                    onMouseOut={() => setHoveredIndex(null)}
                                    className='bar-rect'
                                />
                                {isHovered && (
                                    <text
                                    x={mousePosition.x + 10} // 마우스 위치에 따라 X 좌표 조정
                                    y={mousePosition.y - 10} // 마우스 위치에 따라 Y 좌표 조정
                                    fill="black"
                                    fontSize="14"
                                    fontWeight="bold"
                                    backgroundColor="white"
                                    >
                                )}
                            </g>
                        );
                    })}
                </g>

                <g className='bottom-layer'>
                    <line
                        x1={24}
                        y1={height}
                        x2={width - 4}
                        y2={height}
                        stroke="black"
                        // strokeDasharray="4 4"
                        strokeWidth={1}
                    />
                </g>
                <g className='label-layer'>
                    {data.map((d, i) => {
                        let currX = barWidth * i;
                        return (
                            <text
                            x={currX + barWidth / 2 + 25}
                            y={height + 20}
                            textAnchor="middle"
                            // fontSize="12"
                            fontWeight="bold"
                            fill="#333"
                        >
                            {d.label}
                        </text>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

export default BarChart;
