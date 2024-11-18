/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useAxis } from '../Axis/useAxis';
import { useGrid } from '../Grid/useGrid';
import { Option } from '../../types/Option';
import { darkenColor, lightenColor } from '../../utils/color';
import '../../App.css';
import styled, { keyframes } from 'styled-components';
import { index } from 'd3';


const StyledTitle = styled.text`
  font-size: 24px;
  font-weight: bold;
`;

const StyledSubTitle = styled.text`
  font-size: 16px;
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
  fill: rgba(0, 0, 0, 0.7);
  height: 50px;
  rx: 5;
  ry: 5;
  transition: all 0.15s ease-out;
`;

const TooltipTitle = styled.text`
  fill: white;
  font-size: 14px;
  font-weight: bold;
  text-anchor: start;
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

const StyledLine = styled.line<{ finalHeight: number }>`
  animation: ${(props) => growHeight(props.finalHeight)} 0.8s ease-in-out; 
`
interface BarChartProps extends Option {
    onLayoutChange?: (layout: Option['layout']) => void;
    onChartStyleChange?: (style: Option['chartStyle']) => void;
    onTitleChange?: (title: Option['title']) => void;
    onAxisChange?: (axis: Option['axis']) => void;
    onLabelChange?: (label: Option['label']) => void;
  }

const BarChart: React.FC<BarChartProps> = ({
    data,
    title,
    layout: {
        width = 500,
        height = 300,
        padding = 15,
    },
    axis,
    chartStyle: {
        color = 'green',
        hoverColor = darkenColor(color, 0.2),
    },
    tooltip = true,
}) => {
    const values = data.map(item => item.value);
    const yAxisDefaults = {
        fontSize: 14,
        color: '#6E7079'
    };

    const {yAxis, scales, tickCount} = useAxis({data: values, width: width, height: height, minValue: axis?.yAxis?.min, maxValue: axis?.yAxis?.max});
    const {gridLines} = useGrid({data: values, scales, width, height, horizontalLineCnt: tickCount});
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
                    title && ( // 왜 이건 styled Component가 안될까?(다른 건(ex. 툴팁) 잘 됨) <--- 확인 필요!!
                    <g className='title-layer'>
                        <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
                        <StyledTitle 
                            fill='black'
                            textAnchor = {title.titleAlign == 'end'? 'end' : title.titleAlign == 'middle'? 'middle' : 'start'}
                            x={title.titleAlign == 'end'? '100%' : title.titleAlign == 'middle'? '50%' : -10}
                            y={20}
                        >
                            {title.text}
                        </StyledTitle>
                        {title.subTitle && (
                            <StyledSubTitle
                                textAnchor={title.titleAlign}
                                fill='gray'
                                x={title.titleAlign == 'start'? -10 : title.titleAlign == 'middle'? '50%' : '100%'}
                                y={47}
                            >{title.subTitle}</StyledSubTitle>
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
                    {axis?.xAxis?.showSplitLine &&
                        gridLines.vertical.map((el: { id: React.Key | null | undefined; x1: number ; y1: number ; x2: number ; y2: number; }, index: number) => (
                        <line
                            key={el.id}
                            x1={barWidth * index + 25}
                            y1={70}
                            x2={barWidth * index + 25}
                            y2={height}
                            stroke="#e0e0e0"
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
                            x={20}
                            y={tick.position}
                            textAnchor="end"
                            fontSize={axis?.yAxis?.fontSize || yAxisDefaults.fontSize}
                            fill={axis?.yAxis?.color || yAxisDefaults.color}
                        >
                        {tick.value}
                        {axis?.yAxis?.formatter != '' && axis?.yAxis?.formatter}
                        </text>
                    ))}
                </g>
                
                <g className='chart-layer'>
                    {data.map((d, i) => {
                        const barHeight = height - scales.yScale(d.value);
                        const isHovered = hoveredInfo?.index == i;
                        if(isHovered) console.log("hoveredInfo?.index: " + hoveredInfo?.index);

                        if(i < data.length - 1) {

                        }
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
                        <g ref={titleRef}>
                            <circle 
                                cx={-15}
                                cy={-10}
                                r="3" 
                                fill={color} 
                                stroke={color} 
                                stroke-width="7" 
                            />
                            <TooltipTitle
                                y={-5}
                            >
                                {hoveredInfo.label}
                            </TooltipTitle>
                        </g>
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
                        x1={25}
                        y1={height}
                        x2={width}
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