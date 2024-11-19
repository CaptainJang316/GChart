/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useAxis } from '../Axis/useAxis';
import { useGrid } from '../Grid/useGrid';
import { Option } from '../../types/Option';
import { darkenColor, lightenColor } from '../../utils/color';
import '../../App.css';
import styled, { css, keyframes } from 'styled-components';
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

const drawLine = keyframes<{totalLength: number}>`
    from {
        stroke-dashoffset: ${props => props.totalLength};
    }
    to {
        stroke-dashoffset: 0;
    }
`

const fillArea = keyframes`
    0% {
        fill-opacity: 0;
    }
    90% {
        fill-opacity: 0;
    }
    100% {
        fill-opacity: 0.7;  // fill의 최종 투명도
    }
`;

const StyledPathArea = styled.path<{isVisible?: boolean, totalLength?: number, color?: string}>`
    // fill: ${props => props.color};
    fill-opacity: 0;
    stroke: none;
    animation: ${props => 
        props.isVisible && 
        css`${fillArea} 2s ease-out forwards`};
`;

const StyledPath = styled.path<{isVisible?: boolean, totalLength?: number, color?: string, fillArea?: boolean}>`
    fill: ${props => props.fillArea ? `${props.color}55` : 'none'};
    stroke: ${props => props.color};    
    stroke-width: 2;
    stroke-dasharray: ${props => props.totalLength}; // <-- 이것과 
    stroke-dashoffset: ${props => props.totalLength}; // <-- 이것을 둘다 여기서 초기화 지정해줘야 애니메이션 작동함(keyframe에서 from에 설정하면 작동안함)
    animation: ${props => 
        props.isVisible && props.totalLength && 
        css`
            ${drawLine} 1.5s ease-in-out forwards
        `};

    &:hover {
        stroke-width: 3;
    } 
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const AnimatedCircle = styled.circle<{ delay: number }>`
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  ${props =>
    css`
      animation: ${fadeIn} 0.3s ease-out forwards;
      animation-delay: ${props.delay}s;
    `}
`;

interface LineChartProps extends Option {
    onLayoutChange?: (layout: Option['layout']) => void;
    onChartStyleChange?: (style: Option['chartStyle']) => void;
    onTitleChange?: (title: Option['title']) => void;
    onAxisChange?: (axis: Option['axis']) => void;
    onLabelChange?: (label: Option['label']) => void;
  }

const LineChart: React.FC<LineChartProps> = ({
    data,
    title,
    layout: {
        width = 500,
        height = 300,
        padding = 15,
    },
    axis,
    chartStyle: {
        fillArea = false,
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

    const {yAxis, scales, tickCount} = useAxis({
        data: values, 
        width: width, 
        height: height, 
        minValue: axis?.yAxis?.min, 
        maxValue: axis?.yAxis?.max
    });
    const {gridLines} = useGrid({
        data: values, 
        scales, width, 
        height, 
        horizontalLineCnt: tickCount
    });
    // const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    const barWidth = axis?.xAxis?.boundaryGap? (width - 30) / (data.length-1) : (width - 30) / data.length;

    const [isVisible, setIsVisible] = useState(false);

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
    const [pathLength, setPathLength] = useState(0);
    
    const titleRef = useRef<SVGTextElement | null>(null);
    const textRef = useRef<SVGTextElement | null>(null);
    const pathRef = useRef<SVGPathElement | null>(null);
    
    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (titleRef.current && textRef.current) {
        const titleBox = titleRef.current.getBBox();
        const textBox = textRef.current.getBBox();
        const maxWidth = Math.max(titleBox.width, textBox.width);
    
        // 여유 공간을 주기 위해 +16 정도 추가
        setRectWidth(maxWidth + 20);
        }
    }, [hoveredInfo, title]);

    useEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            setPathLength(length);
        }
    }, [data])

    const handleMouseMove = (e: React.MouseEvent<SVGElement, MouseEvent>, value: number, label: string, index: number) => {
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

    // const createPathData = () => {
    //     return data.map((d, i) => {
    //         if(axis?.xAxis?.boundaryGap) {
    //             if (i === 0) return `M ${25} ${scales.yScale(d.value)}`;
    //             return `L ${25 + (i * barWidth)} ${scales.yScale(d.value)}`;
    //         } else {
    //             if (i === 0) return `M ${barWidth - (barWidth / 6) - 5 + (i * barWidth)} ${scales.yScale(d.value)}`;
    //             return `L ${barWidth - (barWidth / 6) - 5 + (i * barWidth)} ${scales.yScale(d.value)}`;
    //         }
    //     }).join(' ');
    // };

    // const createPathData = () => {
    //     let pathData = '';
        
    //     // 시작점 이동
    //     if(axis?.xAxis?.boundaryGap) {
    //         pathData = `M 25 ${scales.yScale(data[0].value)}`;
    //     } else {
    //         pathData = `M ${barWidth - (barWidth / 6) - 5} ${scales.yScale(data[0].value)}`;
    //     }
        
    //     // 상단 라인 그리기
    //     data.forEach((d, i) => {
    //         if(i === 0) return; // 첫 점은 이미 M 명령어로 이동했으므로 스킵
            
    //         const x = axis?.xAxis?.boundaryGap 
    //             ? 25 + (i * barWidth)
    //             : barWidth - (barWidth / 6) - 5 + (i * barWidth);
                
    //         pathData += ` L ${x} ${scales.yScale(d.value)}`;
    //     });
        
    //     // 마지막 점에서 아래로 수직선
    //     const lastX = axis?.xAxis?.boundaryGap 
    //         ? 25 + ((data.length - 1) * barWidth)
    //         : barWidth - (barWidth / 6) - 5 + ((data.length - 1) * barWidth);
    //     pathData += ` L ${lastX} ${height}`;
        
    //     // 시작점으로 돌아가는 선
    //     const firstX = axis?.xAxis?.boundaryGap 
    //         ? 25 
    //         : barWidth - (barWidth / 6) - 5;
    //     pathData += ` L ${firstX} ${height} Z`;
        
    //     return pathData;
    // };

    const createPathData = () => {
        let pathData = '';
        
        // 시작점
        const firstX = axis?.xAxis?.boundaryGap 
            ? 25 
            : barWidth - (barWidth / 6) - 5;
        pathData = `M ${firstX} ${scales.yScale(data[0].value)}`;
        
        // 데이터 포인트를 따라가는 선
        data.forEach((d, i) => {
            if (i === 0) return; // 첫 점은 이미 M으로 이동했으므로 스킵
            
            const x = axis?.xAxis?.boundaryGap 
                ? 25 + (i * barWidth)
                : barWidth - (barWidth / 6) - 5 + (i * barWidth);
            pathData += ` L ${x} ${scales.yScale(d.value)}`;
        });
        
        // 마지막 점에서 y축 최솟값까지 수직선
        const lastX = axis?.xAxis?.boundaryGap 
            ? 25 + ((data.length - 1) * barWidth)
            : barWidth - (barWidth / 6) - 5 + ((data.length - 1) * barWidth);
        pathData += ` L ${lastX} ${scales.yScale(0)}`; // 수직으로 내려가기
        
        // 시작점으로 수평이동
        pathData += ` L ${firstX} ${scales.yScale(0)}`; // 왼쪽으로 이동
        
        // 다시 시작점으로
        pathData += ` L ${firstX} ${scales.yScale(data[0].value)}`; // 위로 올라가기
        
        return pathData;
    };

    const createLinePath = () => {
        let pathData = '';
        
        // 라인 경로만 생성
        const firstX = axis?.xAxis?.boundaryGap ? 25 : barWidth - (barWidth / 6) - 5;
        pathData = `M ${firstX} ${scales.yScale(data[0].value)}`;
        
        data.forEach((d, i) => {
            if (i === 0) return;
            
            const x = axis?.xAxis?.boundaryGap 
                ? 25 + (i * barWidth)
                : barWidth - (barWidth / 6) - 5 + (i * barWidth);
            pathData += ` L ${x} ${scales.yScale(d.value)}`;
        });
        
        return pathData;
    };

    const createAreaPath = () => {
        let pathData = '';
        
        // 시작점
        const firstX = axis?.xAxis?.boundaryGap ? 25 : barWidth - (barWidth / 6) - 5;
        pathData = `M ${firstX} ${scales.yScale(data[0].value)}`;
        
        // 상단 라인
        data.forEach((d, i) => {
            if (i === 0) return;
            
            const x = axis?.xAxis?.boundaryGap 
                ? 25 + (i * barWidth)
                : barWidth - (barWidth / 6) - 5 + (i * barWidth);
            pathData += ` L ${x} ${scales.yScale(d.value)}`;
        });
        
        // 마지막 지점에서 아래로
        const lastX = axis?.xAxis?.boundaryGap 
            ? 25 + ((data.length - 1) * barWidth)
            : barWidth - (barWidth / 6) - 5 + ((data.length - 1) * barWidth);
        pathData += ` L ${lastX} ${height}`;
        
        // 시작점으로 돌아가기
        pathData += ` L ${firstX} ${height} Z`;
        
        return pathData;
    };

    const getPathPointXSpot = (index: number) => {
        if(axis?.xAxis?.boundaryGap) {
            return 25 + (index * barWidth);
        } else {
            return barWidth - (barWidth / 6) - 5 + (index * barWidth);
        }
    }
    
    const TOTAL_LINE_ANIMATION = 1.5; 
    const calculateAnimationDelay = (index:number) => {
        return (index / (data.length - 1)) * TOTAL_LINE_ANIMATION;
    }

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
                    {/* 영역 채우기 */}
                    <StyledPathArea
                        d={createAreaPath()}
                        isVisible={isVisible}
                        color={`${hoveredInfo.index !== null ? hoverColor : color}33`}
                        onMouseOver={() => setHoveredInfo(prev => ({...prev, index: 0}))}
                        onMouseOut={() => setHoveredInfo(prev => ({...prev, index: null}))}
                    />
                    {/* 라인 그리기 */}
                    <StyledPath
                        ref={pathRef}
                        d={createLinePath()}
                        isVisible={isVisible}
                        totalLength={pathLength}
                        color={hoveredInfo.index !== null ? hoverColor : color}
                        onMouseOver={() => setHoveredInfo(prev => ({...prev, index: 0}))}
                        onMouseOut={() => setHoveredInfo(prev => ({...prev, index: null}))}
                    />

                    {data.map((d, i) => (
                        <AnimatedCircle
                            key={i}
                            cx={getPathPointXSpot(i)}
                            cy={scales.yScale(d.value)}
                            r="4"
                            fill={color}
                            stroke="white"
                            strokeWidth="2"
                            delay={calculateAnimationDelay(i)}
                            onMouseOver={(e) => handleMouseMove(e, d.value, d.label, i)}
                            onMouseOut={() => setHoveredInfo(prev => ({...prev, index: null}))}
                        />
                    ))}
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
                                strokeWidth="7" 
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
                            x={getPathPointXSpot(i)}
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

export default LineChart;