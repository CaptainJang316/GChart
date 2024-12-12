/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { useAxis } from "../Axis/useAxis";
import { useGrid } from "../Grid/useGrid";
import { LineChartProps, Option } from "../../types/Option";
import { darkenColor, lightenColor } from "../../utils/color";
import "../../App.css";
import styled, { css, keyframes } from "styled-components";
import { index } from "d3";
import { number } from "prop-types";

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
  transform: translate(${(props) => props.x}px, ${(props) => props.y}px);
  white-space: nowrap;
  z-index: 10000;
`;

const TooltipGroup = styled.g`
  pointer-events: none;
  transition: transform 0.15s ease-out;
`;

const TooltipRect = styled.rect`
  fill: rgba(0, 0, 0, 0.7);
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

const TooltipWapper = styled.div`
  display: flex;
  text-align: justify;
`;

const TooltipLabel = styled(TooltipTitle)`
  font-size: 12px;
  font-weight: normal;
`;

const TooltipValue = styled(TooltipTitle)`
  font-size: 18px;
  text-anchor: end;
`;

const drawLine = keyframes<{ totalLength: number }>`
    from {
        stroke-dashoffset: ${(props) => props.totalLength};
    }
    to {
        stroke-dashoffset: 0;
    }
`;

const fillArea = keyframes`
    0% {
        fill-opacity: 0;
    }
    90% {
        fill-opacity: 0;
    }
    100% {
        fill-opacity: 0.3;  // fill의 최종 투명도
    }
`;

const StyledPathArea = styled.path<{
  isVisible?: boolean;
  totalLength?: number;
  color?: string;
}>`
  fill: ${(props) => props.color};
  fill-opacity: 0;
  stroke: none;
  animation: ${(props) =>
    props.isVisible &&
    css`
      ${fillArea} 1.6s ease-out forwards
    `};
`;

const StyledPath = styled.path<{
  isVisible?: boolean;
  totalLength?: number;
  color?: string;
  fillArea?: boolean;
}>`
  fill: none;
  stroke: ${(props) => props.color};
  stroke-width: 2;
  stroke-dasharray: ${(props) => props.totalLength}; // <-- 이것과
  stroke-dashoffset: ${(props) =>
    props.totalLength}; // <-- 이것을 둘다 여기서 초기화 지정해줘야 애니메이션 작동함(keyframe에서 from에 설정하면 작동안함)
  animation: ${(props) =>
    props.isVisible &&
    props.totalLength &&
    css`
      ${drawLine} 1.5s ease-in-out forwards
    `};

  &:hover {
    stroke-width: 3;
  }
`;

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
  ${(props) => css`
    animation: ${fadeIn} 0.3s ease-out forwards;
    animation-delay: ${props.delay}s;
  `}
`;

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  layout: { width = 500, height = 300, padding = 15 },
  axis,
  chartStyle: { fillArea = false, lineStyle = 'solid' },
  tooltip = true,
}) => {
  const lineData = data.data.map((item) => item.value);
  const lineName = data.data.map((item) => item.name);
  const lineColors = data.data.map((item) => item.color);
  const labels = data.xLabel.map((item) => item);

  const yAxisDefaults = {
    fontSize: 14,
    color: "#6E7079",
  };

  const { yAxis, scales, tickCount } = useAxis({
    data: lineData[0],
    width: width,
    height: height,
    minValue: axis?.yAxis?.min,
    maxValue: axis?.yAxis?.max,
  });
  const { gridLines } = useGrid({
    data: lineData[0],
    scales,
    width,
    height,
    horizontalLineCnt: tickCount,
  });

  const [isVisible, setIsVisible] = useState(false);

  const [hoveredInfo, setHoveredInfo] = useState<{
    index: number | null;
    x: number;
    y: number;
    values?: number[];
    names?: string[];
  }>({
    index: null,
    x: 0,
    y: 0,
  });

  const [hoveredLineIndex, setHoveredLineIndex] = useState<null | number>(null);

  const [tooltipRectWidth, setTooltipRectWidth] = useState(0);
  const [tooltipRectHeight, setTooltipRectHight] = useState(0);
  const [tooltipSpotX, setTooltipSpotX] = useState(0);
  const [tooltipSpotY, setTooltipSpotY] = useState(0);

  const [pathLength, setPathLength] = useState<number[]>([]);

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  useEffect(() => {
    let linePathsLength: number[] = [];
    for (let i = 0; i < lineData.length; i++) {
      if (pathRefs.current.length > 0) {
        const length = pathRefs.current[i]!.getTotalLength();
        linePathsLength = [...linePathsLength, length];
      }
    }
    setPathLength(linePathsLength);
  }, [data]);

  // Example: 특정 path에 ref를 할당
  const addPathRef = (i: number, element: SVGPathElement | null) => {
    pathRefs.current[i] = element; // 해당 index에 path 참조 저장
  };

  const handleMouseMoveOverChart = (
    e: React.MouseEvent<SVGRectElement, MouseEvent>
  ) => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const point = svgRef.current.createSVGPoint();
    point.x = e.clientX - svgRect.left;
    point.y = e.clientY - svgRect.top;

    const xPositions = lineData[0].map((_, index) =>
      axis?.xAxis?.boundaryGap
        ? barWidth / 2 + 25 + index * barWidth
        : 25 + index * barWidth
    );

    const closestIndex = xPositions.reduce(
      (prev, curr, index) =>
        Math.abs(curr - point.x) < Math.abs(xPositions[prev] - point.x)
          ? index
          : prev,
      0
    );

    // 모든 라인의 해당 인덱스 값 수집
    const closestValues = lineData.map((line) => line[closestIndex]);
    const closestNames = lineName.map((name) => name);

    setHoveredInfo({
      index: closestIndex,
      x: point.x,
      y: point.y,
      values: closestValues,
      names: closestNames,
    });

    calculateTooltipSize();

    hoveredInfo.x + tooltipRectWidth > width
      ? setTooltipSpotX(hoveredInfo.x - tooltipRectWidth - 10)
      : setTooltipSpotX(hoveredInfo.x + 20);
    hoveredInfo.y + tooltipRectHeight > height + 20
      ? setTooltipSpotY(hoveredInfo.y - tooltipRectHeight + 20)
      : setTooltipSpotY(hoveredInfo.y);
  };

  const handleMouseLeave = () => {
    setHoveredInfo((prev) => ({ ...prev, index: null }));
  };

  // 툴팁 너비 계산 로직
  const calculateTooltipSize = () => {
    if (!hoveredInfo.values) return 0;

    // 각 라인의 텍스트 길이를 고려한 너비 계산
    const maxNameLength = Math.max(
      ...hoveredInfo.names!.map((name) => name.length)
    );
    const maxValueLength = Math.max(
      ...hoveredInfo.values!.map((value) => value.toString().length)
    );

    const nameFont = 10;
    const valueFont = 18;

    const maxWidth = Math.max(
      140,
      maxNameLength * nameFont + maxValueLength * valueFont + 15
    );

    setTooltipRectWidth(maxWidth);
    setTooltipRectHight(hoveredInfo.values.length * 25 + 40);
  };

  // 각 bar의 영역 설정(boundaryGap 여부에 따라 너비 달라짐)
  const barWidth = axis?.xAxis?.boundaryGap
    ? (width - 30) / lineData[0].length
    : (width - 30) / (lineData[0].length - 1);

  let firstX: number;
  let pathData = "";
  let lastX: number;
  const createSolidLinePath = (currLineValues: number[]) => {

    // 라인 경로만 생성
    let currX = axis?.xAxis?.boundaryGap ? barWidth / 2 + 25 : 25;
    firstX = currX;
    pathData = `M ${currX} ${scales.yScale(currLineValues[0])}`;

    currLineValues.forEach((d, i) => {
      if (i === 0) return;

      currX += barWidth;
      pathData += ` L ${currX} ${scales.yScale(d)}`;
    });

    lastX = currX;
    return pathData;
  };

  const createSmoothLinePath = (currLineValues: number[]) => {
    const currXValues: number[] = [];
    let currX = axis?.xAxis?.boundaryGap ? barWidth / 2 + 25 : 25;
    firstX = currX;
  
    // X 좌표 배열 생성
    currLineValues.forEach(() => {
      currXValues.push(currX);
      currX += barWidth;
    });
  
    // M 명령으로 시작점 설정
    pathData = `M ${currXValues[0]} ${scales.yScale(currLineValues[0])}`;
  
    for (let i = 0; i < currLineValues.length - 1; i++) {
      const x0 = currXValues[i - 1] || currXValues[i]; // 이전 X
      const y0 = scales.yScale(currLineValues[i - 1] || currLineValues[i]); // 이전 Y
  
      const x1 = currXValues[i]; // 현재 X
      const y1 = scales.yScale(currLineValues[i]); // 현재 Y
  
      const x2 = currXValues[i + 1]; // 다음 X
      const y2 = scales.yScale(currLineValues[i + 1]); // 다음 Y
  
      const x3 = currXValues[i + 2] || x2; // 다다음 X
      const y3 = scales.yScale(currLineValues[i + 2] || currLineValues[i + 1]); // 다다음 Y
  
      // 제어점 계산 (Catmull-Rom 스플라인)
      const cp1X = x1 + (x2 - x0) / 6;
      const cp1Y = y1 + (y2 - y0) / 6;
  
      const cp2X = x2 - (x3 - x1) / 6;
      const cp2Y = y2 - (y3 - y1) / 6;
  
      // 곡선 연결
      pathData += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x2} ${y2}`;
    }
  
    return pathData;
  };

  const createSolidAreaPath = (currLineValues: number[]) => {
    let areaData = pathData;

    // Area 만들기 위한 작업(path 닫기)
    // 1. 마지막 지점에서 아래로
    areaData += ` L ${currX} ${height}`;
    // 2. 시작점으로 돌아가기
    areaData += ` L ${firstX} ${height} Z`;

    return pathData;
  };

  const getPathPointXSpot = (index: number) => {
    if (axis?.xAxis?.boundaryGap) {
      return barWidth / 2 + 25 + index * barWidth;
    } else {
      return 25 + index * barWidth;
    }
  };

  const TOTAL_LINE_ANIMATION = 1.5;
  const calculateAnimationDelay = (index: number) => {
    return (index / (lineData[0].length - 1)) * TOTAL_LINE_ANIMATION;
  };

  return (
    // svg 요소 안에, 차트를 그린다.
    <div
      style={{
        display: "inline-block",
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height + 30}`}
        style={{ border: "1px solid #ccc", padding: `${padding}px` }}
      >
        {title && ( // 왜 이건 styled Component가 안될까?(다른 건(ex. 툴팁) 잘 됨) <--- 확인 필요!!
          <g className="title-layer">
            <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
            <StyledTitle
              fill="black"
              textAnchor={
                title.titleAlign == "end"
                  ? "end"
                  : title.titleAlign == "middle"
                    ? "middle"
                    : "start"
              }
              x={
                title.titleAlign == "end"
                  ? "100%"
                  : title.titleAlign == "middle"
                    ? "50%"
                    : -10
              }
              y={20}
            >
              {title.text}
            </StyledTitle>
            {title.subTitle && (
              <StyledSubTitle
                textAnchor={title.titleAlign}
                fill="gray"
                x={
                  title.titleAlign == "start"
                    ? -10
                    : title.titleAlign == "middle"
                      ? "50%"
                      : "100%"
                }
                y={47}
              >
                {title.subTitle}
              </StyledSubTitle>
            )}
          </g>
        )}
        <g className="grid-layer">
          {gridLines.horizontal.map(
            (
              el: {
                id: React.Key | null | undefined;
                x1: number;
                y1: number;
                x2: number;
                y2: number;
              },
              index: number
            ) => (
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
            )
          )}
          {axis?.xAxis?.showSplitLine &&
            gridLines.vertical.map(
              (
                el: {
                  id: React.Key | null | undefined;
                  x1: number;
                  y1: number;
                  x2: number;
                  y2: number;
                },
                index: number
              ) =>
                hoveredInfo.index === index && (
                  <line
                    key={el.id}
                    x1={
                      axis?.xAxis?.boundaryGap
                        ? barWidth / 2 + 25 + barWidth * index
                        : 25 + barWidth * index
                    }
                    y1={70}
                    x2={
                      axis?.xAxis?.boundaryGap
                        ? barWidth / 2 + 25 + barWidth * index
                        : 25 + barWidth * index
                    }
                    y2={height}
                    stroke="#a0a0a0"
                    strokeDasharray="4 2"
                    strokeWidth={1}
                  />
                )
            )}
          {gridLines.vertical.map(
            (
              el: {
                id: React.Key | null | undefined;
                x1: number;
                y1: number;
                x2: number;
                y2: number;
              },
              index: number
            ) => (
              <line
                key={el.id}
                x1={barWidth * index + 25}
                y1={height}
                x2={barWidth * index + 25}
                y2={height + 5}
                stroke="black"
                strokeWidth={1}
              />
            )
          )}
        </g>

        <g className="axis-layer">
          {yAxis.ticks.map((tick) => (
            <text
              x={20}
              y={tick.position}
              textAnchor="end"
              fontSize={axis?.yAxis?.fontSize || yAxisDefaults.fontSize}
              fill={axis?.yAxis?.color || yAxisDefaults.color}
            >
              {tick.value}
              {axis?.yAxis?.formatter != "" && axis?.yAxis?.formatter}
            </text>
          ))}
        </g>

        {/* 차트 라인X, 전체 데이터 영역을 hover하기 위해, 해당 영역 전체를 감싸는 투명 rect 생성 */}
        <rect
          x={25}
          y={70}
          width={width - 30}
          height={height - 70}
          fill="transparent"
          onMouseMove={handleMouseMoveOverChart}
          onMouseLeave={handleMouseLeave}
        />

        <g
          className="chart-layer"
          onMouseMove={(e) =>
            handleMouseMoveOverChart(
              e as React.MouseEvent<SVGRectElement, MouseEvent>
            )
          }
          onMouseLeave={handleMouseLeave}
        >
          {
            /* 영역 채우기 */
            lineData.map(
              (v, i) =>
                fillArea && (
                  <StyledPathArea
                    d={createSolidAreaPath(v)}
                    isVisible={isVisible}
                    color={`${hoveredLineIndex == i ? darkenColor(lineColors[i], 0.2) : lineColors[i]}`}
                    onMouseOver={() => setHoveredLineIndex(i)}
                    onMouseOut={() => setHoveredLineIndex(null)}
                  />
                )
            )
          }
          {
            /* 라인 그리기 */
            lineData.map((v, i) => (
              <StyledPath
                ref={(el) => addPathRef(i, el)}
                d={lineStyle == 'solid'? createSolidLinePath(v) : createSmoothLinePath(v)}
                isVisible={isVisible}
                totalLength={pathLength[i]}
                color={
                  hoveredLineIndex == i
                    ? darkenColor(lineColors[i], 0.2)
                    : lineColors[i]
                }
                onMouseOver={() => setHoveredLineIndex(i)}
                onMouseOut={() => setHoveredLineIndex(null)}
              />
            ))
          }
          {lineData.map((_, i) =>
            lineData[i].map((d, j) => (
              <AnimatedCircle
                key={j}
                cx={getPathPointXSpot(j)}
                cy={scales.yScale(d)}
                r="4"
                fill={lineColors[i]}
                stroke="white"
                strokeWidth="2"
                delay={calculateAnimationDelay(i)}
                onMouseOver={() => setHoveredLineIndex(i)}
                onMouseOut={() => setHoveredLineIndex(null)}
              />
            ))
          )}
        </g>

        {/* 라인 툴팁 */}
        <g className="tooltip-layer">
          {tooltip && hoveredInfo?.index != null && hoveredInfo.values && (
            <TooltipGroup
              ref={tooltipRef}
              transform={`translate(${tooltipSpotX}, ${tooltipSpotY})`}
            >
              <TooltipRect
                x={-10}
                y={-20}
                width={tooltipRectWidth}
                height={tooltipRectHeight}
              />

              {/* 라벨 정보 */}
              <TooltipTitle x={5} y={5}>
                {labels[hoveredInfo.index]}
              </TooltipTitle>

              {/* 각 라인별 정보 */}
              {hoveredInfo.values.map((value, index) => (
                <g key={index} transform={`translate(0, ${25 * (index + 1)})`}>
                  <circle cx={10} cy={0} r="5" fill={lineColors[index]} />
                  <TooltipLabel x={20} y={4}>
                    {hoveredInfo.names![index]}:
                  </TooltipLabel>
                  <TooltipValue x={tooltipRectWidth - 20} y={4}>
                    {value}
                  </TooltipValue>
                </g>
              ))}
            </TooltipGroup>
          )}
        </g>

        <g className="bottom-layer">
          <line
            x1={25}
            y1={height}
            x2={width}
            y2={height}
            stroke="black"
            strokeWidth={1}
          />
        </g>
        <g className="label-layer">
          {lineData[0].map((_, i) => {
            return (
              <text
                x={getPathPointXSpot(i)}
                y={height + 20}
                textAnchor="middle"
                // fontSize="12"
                fontWeight="bold"
                fill="#333"
              >
                {labels[i]}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
