/* eslint-disable */
import React, { useState } from 'react';
import { useAxis } from '../Axis/useAxis';
import { useGrid } from '../Grid/useGrid';
import { Option } from '../../types/Option';
import { darkenColor, lightenColor } from '../../utils/color';
import '../../App.css';
import { animated, config, useSpring } from '@react-spring/web';

interface BarProps {
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
    color?: string;
    hoverColor?: string;
    delay?: number;
  }

const AnimatedBar = ({ x, y, width, height, value, color, hoverColor, delay = 0 }: BarProps) => {
    const [isHovered, setIsHovered] = useState(false);
  
    const springs = useSpring({
      from: { 
        height: 0, 
        y: y + height,
        opacity: 1,
        fill: color,
      },
      to: { 
        height, 
        y,
        opacity: isHovered ? 0.9 : 1,
        fill: isHovered ? hoverColor : color
      },
      delay,
      config: {
        ...config.default,
        tension: 500,
        friction: 40
      }
    });
  
    return (
      <g>
        <animated.rect
          x={x}
          y={springs.y}
          width={width}
          height={springs.height}
          fill={springs.fill}
          opacity={springs.opacity}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
        />
        {isHovered && (
          <animated.text
            x={x + width / 2}
            y={springs.y}
            dy={-10}
            textAnchor="middle"
            fill="#312e81"
            opacity={springs.opacity}
          >
            {value}
          </animated.text>
        )}
      </g>
    );
  };

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
        hoverColor = lightenColor(color, 0.1),
    },
    tooltip = true
}) => {
    const values = data.map(item => item.value);
    const {xAxis, yAxis, scales} = useAxis({data: values, width: width, height: height, axisCnt: axisCnt});
    const {gridLines} = useGrid({data: values, scales, width, height, horizontalLineCnt: axisCnt});

    // const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = (width - 30) / data.length;
    // const yTicks = 10;
    // const tickValues = Array.from({ length: yTicks }, (_, i) => (maxValue / yTicks) * i);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        // svg 요소 안에, 차트를 그린다.
        <div style={{ display: 'inline-block', width: `${width}px`, height: `${height}px`}}>
            <svg width='100%' height='100%' viewBox={`0 0 ${width} ${height + 30}`} style={{ border: '1px solid #ccc', padding: `${padding}px`}}>
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
                                <AnimatedBar
                                    width={barWidth - (barWidth / 6)}
                                    height={barHeight}
                                    // fill={isHovered? hoverColor : color}
                                    x={barWidth / 12 + 25}
                                    y={0}
                                    value={d.value}
                                    delay={i * 100}
                                    color={color}
                                    hoverColor={hoverColor}
                                    // onMouseOver={() => setHoveredIndex(i)}
                                    // onMouseOut={() => setHoveredIndex(null)}
                                    // className='bar-rect'
                                />
                                <text
                                    x={barWidth / 2 + 25}
                                    y={barHeight / 2}
                                    textAnchor="middle"
                                    // fontSize="10"
                                    fill="white"
                                >
                                    {d.value}
                                </text>
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
