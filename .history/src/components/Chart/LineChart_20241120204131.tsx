/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useAxis } from '../Axis/useAxis';
import { useGrid } from '../Grid/useGrid';
import { LineChartProps, Option } from '../../types/Option';
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
    fill: ${props => props.color};
    fill-opacity: 0;
    stroke: none;
    animation: ${props => 
        props.isVisible && 
        css`${fillArea} 1.6s ease-out forwards`};
`;

const StyledPath = styled.path<{isVisible?: boolean, totalLength?: number, color?: string, fillArea?: boolean}>`
    fill: none;
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
    const items = data.data.map(item => item.value);
    
    for (let i = 0; i < items.length; i++) {
        const values = items[i];
        
    }

    
};

export default LineChart;