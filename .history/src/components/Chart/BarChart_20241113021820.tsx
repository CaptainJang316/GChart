/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useAxis } from '../Axis/useAxis';
import { useGrid } from '../Grid/useGrid';
import { Option } from '../../types/Option';
import { darkenColor, lightenColor } from '../../utils/color';
import '../../App.css';
import { animated, config, useSpring } from '@react-spring/web';
import styled, { keyframes } from 'styled-components';
import { index } from 'd3';


const StyledTitle = styled.text`
  font-size: 18px;
  font-weight: bold;
`;

const StyledTooltip = styled.text<{ x: number; y: number }>`
  fill: white;
  font-size: 14px;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 5px 10px;
  border-radius: 5px;
  pointer-events: none;
  transform: translate(${props => props.x}px, ${props => props.y}px);
  white-space: nowrap;
  z-index: 10000;
`;

const TooltipGroup = styled.g`
  pointer-events: none;
  transition: transform 0.15s ease-out;
`;

const TooltipRect = styled.rect`
  height: 50px;
  transition: all 0.15s ease-out;
`;

const TooltipTitle = styled.text`
  font-size: 14px;
  font-weight: bold;
  transition: all 0.15s ease-out;
`;

const TooltipText = styled(TooltipTitle)`
  font-size: 12px;
  font-weight: normal;
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
        width = 500,
        height = 300,
        padding = 15,
        axisCnt = 5,
    },
    style: {
        color = 'green',
        hoverColor = darkenColor(color, 0.2),
    },
    tooltip = true,
}) => {
    const values = data.map(item => item.value);
    const {xAxis, yAxis, scales} = useAxis({data: values, width: width, height: height, axisCnt: axisCnt});
    const {gridLines} = useGrid({data: values, scales, width, height, horizontalLineCnt: axisCnt});
    // const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    const barWidth = (width - 30) / data.length;

    const [hoveredInfo, setHoveredInfo] = useState<{
        index: number | null; 
        x: number; 
        y: number;
        value?: number;
        label?: string;
    }>({
        index: null,
        x: 0,
        y: 0
    });

    const [rectWidth, setRectWidth] = useState(0);
    
    const titleRef = useRef<SVGTextElement | null>(null);
    const textRef = useRef<SVGTextElement | null>(null);
    
    useEffect(() => {
        if (titleRef.current && textRef.current) {
        const titleBox = titleRef.current.getBBox();
        const textBox = textRef.current.getBBox();
        const maxWidth = Math.max(titleBox.width, textBox.width);
    
        // 여유 공간을 주기 위해 +16 정도 추가
        setRectWidth(maxWidth + 20);
        }
    }, [hoveredInfo, title]);

    const handleMouseMove = (e: React.MouseEvent<SVGRectElement, MouseEvent>, value: number, label: string, index: number) => {
        const svgElement = e.currentTarget.closest('svg') as SVGSVGElement | null;
        if (svgElement) {
            const point = svgElement.createSVGPoint();
            point.x = e.clientX;
            point.y = e.clientY;
            const svgPoint = point.matrixTransform(svgElement.getScreenCTM()?.inverse());
            
            setHoveredInfo({
                index: index,
                x: svgPoint.x - 25,
                y: svgPoint.y - 35,
                value,
                label
            });
        }
    };

    return (
        // svg 요소 안에, 차트를 그린다.
        <div style={{ display: 'inline-block', width: `${width}px`, height: `${height}px`}}>
            <svg width='100%' height='100%' viewBox={`0 0 ${width} ${height + 30}`} style={{ border: '1px solid #ccc', padding: `${padding}px`}}>
                {               
                    title && (
                    <g className='title-layer'>
                        <StyledTitle 
                            textAnchor={title.titleAlign}
                            >{title.text}</StyledTitle>
                        {title.subTitle && (
                            <text>{title.subTitle}</text>
                        )}
                    </g>)
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
                        const isHovered = hoveredInfo?.index == i;
                        if(isHovered) console.log("hoveredInfo?.index: " + hoveredInfo?.index);

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
                                    onMouseOver={() => setHoveredInfo(prev => ({...prev, index: i}))}
                                    onMouseMove={(e) => handleMouseMove(e, d.value, d.label, i)}
                                    onMouseOut={() => setHoveredInfo(prev => ({...prev, index: null}))}
                                    className='bar-rect'
                                />
                            </g>
                        );
                    })}
                </g>

                <g className='tooltip-layer'>
                {tooltip && hoveredInfo?.index != null && (
                    <TooltipGroup transform={`translate(${hoveredInfo.x}, ${hoveredInfo.y})`}>
                        <TooltipRect
                            x={-30}
                            y={-25}
                            width={rectWidth}
                        />
                        <circle 
                            cx={-15}
                            cy={-10}
                            r="3" 
                            fill={color} 
                            stroke={color} 
                            stroke-width="7" 
                        />
                        <TooltipTitle
                            ref={titleRef}
                            y={-5}
                        >
                            {hoveredInfo.label}
                        </TooltipTitle>
                        <TooltipText
                            ref={textRef}
                            x={-20}
                            y={15}
                        >
                            {title?.subTitle}: {hoveredInfo.value}
                        </TooltipText>
                    </TooltipGroup>
                    )}
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
