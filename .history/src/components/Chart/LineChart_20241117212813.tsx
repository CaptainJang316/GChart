/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useAxis } from '../Axis/useAxis';
import { useGrid } from '../Grid/useGrid';
import { Option } from '../../types/Option';
import { darkenColor, lightenColor } from '../../utils/color';
import '../../App.css';
import styled, { keyframes, css } from 'styled-components';

// 라인 그리기 애니메이션 정의
const drawLine = keyframes`
  from {
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
`;

// 애니메이션이 적용된 라인 컴포넌트
const AnimatedLine = styled.line<{ isVisible?: boolean }>`
  stroke-width: 2;
  transition: stroke 0.3s ease-in-out;
  stroke-dasharray: 1000;
  stroke-dashoffset: ${props => (props.isVisible ? '0' : '1000')};
  animation: ${props =>
    props.isVisible &&
    css`
      ${drawLine} 1s ease-in-out forwards
    `};

  &:hover {
    stroke-width: 3;
  }
`;

// 기존 스타일 컴포넌트들...
const StyledTitle = styled.text`
  font-size: 24px;
  font-weight: bold;
`;

const StyledSubTitle = styled.text`
  font-size: 16px;
`;

const TooltipGroup = styled.g`
  pointer-events: none;
  transition: transform 0.15s ease-out;
  opacity: 0;
  animation: fadeIn 0.2s ease-out forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// ... (나머지 스타일 컴포넌트들은 동일)

const LineChart: React.FC<BarChartProps> = ({
    // ... (props는 동일)
}) => {
    // 기존 상태들...
    const [isVisible, setIsVisible] = useState(false);

    // 컴포넌트 마운트 시 애니메이션 트리거
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // ... (기존 로직들)

    return (
        <div style={{ display: 'inline-block', width: `${width}px`, height: `${height}px`}}>
            <svg width='100%' height='100%' viewBox={`0 0 ${width} ${height + 30}`} style={{ border: '1px solid #ccc', padding: `${padding}px`}}>
                {/* ... (기존 레이어들) */}
                
                <g className='chart-layer'>
                    {data.map((d, i) => {
                        const isHovered = hoveredInfo?.index == i;

                        if(i < data.length - 1) {
                            const barHeight1 = height - scales.yScale(data[i].value);
                            const barHeight2 = height - scales.yScale(data[i+1].value);
                            return (
                                <g key={i} transform={`translate(${i * barWidth}, ${height})`}>
                                    <AnimatedLine
                                        x1={barWidth - (barWidth / 6) - 5}
                                        y1={-1 * barHeight1}
                                        x2={barWidth * 2 - 20}
                                        y2={-1 * barHeight2}
                                        stroke={isHovered? hoverColor : color}
                                        isVisible={isVisible}
                                        onMouseOver={() => setHoveredInfo(prev => ({...prev, index: i}))}
                                        onMouseOut={() => setHoveredInfo(prev => ({...prev, index: null}))}
                                        className='line-rect'
                                    />
                                </g>
                            );
                        }
                        return null;
                    })}
                </g>

                {/* ... (나머지 레이어들) */}
            </svg>
        </div>
    );
};

export default LineChart;