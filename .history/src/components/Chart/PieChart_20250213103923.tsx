import { useState } from "react";
import { PieChartProps } from "../../types/Option";
import styled, { keyframes } from "styled-components";
import { darkenColor } from "../../utils/color";

// 애니메이션 스타일
const rotateAnimation = keyframes`
    from {
        transform: rotate(0deg);
        transform-origin: center;
        stroke-dashoffset: 100;
    }
    to {
        transform: rotate(360deg);
        transform-origin: center;
        stroke-dashoffset: 0;
    }
`;

const StyledPath = styled.path<{ delay: number }>`
  transition: all 0.3s ease;
  animation: ${rotateAnimation} 0.5s ease-out;
`;
const TooltipGroup = styled.g`
  pointer-events: none;
  transition: transform 0.15s ease-out;
`;

const TooltipRect = styled.rect`
  fill: rgba(0, 0, 0, 0.7);
  rx: 5;
  ry: 5;
`;

const TooltipText = styled.text`
  fill: white;
  font-size: 12px;
  text-anchor: middle;
`;

interface TooltipInfoProps {
  x: number | null;
  y: number | null;
  value: number;
  label: string;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  layout: { width = 500, height = 300, padding = 40 },
  chartStyle: { innerRadius = 0, startAngle = 90, padAngle = 0 },
  tooltip = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfoProps>({
    x: null,
    y: null,
    value: 0,
    label: "",
  });

  // 중심점 계산
  const centerX = width / 2;
  const centerY = height / 2;

  // 반지름 계산산
  const radius = Math.min(width, height) / 2 - padding;

  // 데이터 총합 계산산
  const total = data.values.reduce((acc, val) => acc + val, 0);

  // 각도 계산 함수
  const calculateAngles = () => {
    let currentAngle = startAngle;
    const segments = [];

    for (let i = 0; i < data.values.length; i++) {
      const percentage = data.values[i] / total;
      const angle = percentage * 360;

      // 시작각과 끝각을 라디안으로 변환
      const startRad = (currentAngle * Math.PI) / 180;
      const endRad = ((currentAngle + angle) * Math.PI) / 180;

      // 좌표 계산
      const startX = centerX + radius * Math.cos(startRad);
      const startY = centerY + radius * Math.sin(startRad);
      const endX = centerX + radius * Math.cos(endRad);
      const endY = centerY + radius * Math.sin(endRad);

      // 내부 반지름이 있는 경우 (도넛 차트)
      const innerStartX = centerX + innerRadius * Math.cos(startRad);
      const innerStartY = centerY + innerRadius * Math.sin(startRad);
      const innerEndX = centerX + innerRadius * Math.cos(endRad);
      const innerEndY = centerY + innerRadius * Math.sin(endRad);

      // path 데이터 생성
      const largeArcFlag = angle > 180 ? 1 : 0;
      const pathData =
        innerRadius > 0
          ? `M ${innerStartX} ${innerStartY}
                   L ${startX} ${startY}
                   A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
                   L ${innerEndX} ${innerEndY}
                   A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`
          : `M ${centerX} ${centerY}
                   L ${startX} ${startY}
                   A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
                   Z`;

      segments.push({
        path: pathData,
        percentage,
        value: data.values[i],
        label: data.labels[i],
        color: data.colors?.[i] || data.colors[i % data.colors.length],
        currentAngle,
        angle,
      });

      currentAngle += angle;
    }

    return segments;
  };

  const handleMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    value: number,
    label: string
  ) => {
    const svgElement = e.currentTarget.closest("svg");
    if (svgElement) {
      const point = svgElement.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const svgPoint = point.matrixTransform(
        svgElement.getScreenCTM()?.inverse()
      );

      setTooltipInfo({
        x: svgPoint.x,
        y: svgPoint.y,
        value,
        label,
      });
    }
  };

  const segments = calculateAngles();

  return (
    <div
      style={{
        display: "inline-block",
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ border: "1px solid #ccc" }}
      >
        {title && (
          <g className="title-layer">
            <text
              x={width / 2}
              y={30}
              textAnchor="middle"
              fontSize="24"
              fontWeight="bold"
            >
              {title.text}
            </text>
            {title.subTitle && (
              <text
                x={width / 2}
                y={55}
                textAnchor="middle"
                fontSize="16"
                fill="gray"
              >
                {title.subTitle}
              </text>
            )}
          </g>
        )}

        <g className="chart-layer">
          {segments.map((segment, i) => (
            <StyledPath
              key={i}
              d={segment.path}
              fill={
                hoveredIndex == i
                  ? darkenColor(segment.color, 0.2)
                  : segment.color
              }
              delay={i * 70}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseMove={(e) =>
                handleMouseMove(e, segment.value, segment.label)
              }
              onMouseLeave={() => setHoveredIndex(null)}
            ></StyledPath>
          ))}
        </g>

        {tooltip && hoveredIndex !== null && (
          <TooltipGroup
            transform={`translate(${tooltipInfo.x}, ${tooltipInfo.y})`}
          >
            <TooltipRect x={-60} y={-40} width={120} height={40} />
            <TooltipText y={-20}>{tooltipInfo.label}</TooltipText>
            <TooltipText y={0}>
              {tooltipInfo.value} (
              {((tooltipInfo.value / total) * 100).toFixed(1)}%)
            </TooltipText>
          </TooltipGroup>
        )}

        <g className="legend-layer">
          {segments.map((segment, i) => (
            <g key={i} transform={`translate(0, ${i * 25})`}>
              <rect width={15} height={15} fill={segment.color} rx={3} />
              <text x={25} y={12} fontSize="12">
                {segment.label} ({(segment.percentage * 100).toFixed(1)}%)
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default PieChart;
