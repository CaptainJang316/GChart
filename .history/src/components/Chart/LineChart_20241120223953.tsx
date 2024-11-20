import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

// 타입 정의 개선
interface DataPoint {
  label: string;
  value: number;
}

interface LineSeriesProps {
  label: string;
  data: DataPoint[];
  color?: string;
}

interface ChartProps {
  series: LineSeriesProps[];
  width?: number;
  height?: number;
  padding?: number;
  title?: string;
}

const MultiLineChart: React.FC<ChartProps> = ({
  series,
  width = 600,
  height = 400,
  padding = 40,
  title
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    seriesIndex: number;
    pointIndex: number;
  } | null>(null);

  // 데이터 범위 계산
  const chartData = useMemo(() => {
    const allValues = series.flatMap(s => s.data.map(d => d.value));
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    
    return {
      minValue,
      maxValue,
      maxLength: Math.max(...series.map(s => s.data.length))
    };
  }, [series]);

  // Y축 스케일 계산
  const getYScale = (value: number) => {
    const { minValue, maxValue } = chartData;
    return height - padding - ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);
  };

  // X축 스케일 계산
  const getXScale = (index: number) => {
    const { maxLength } = chartData;
    return padding + (index / (maxLength - 1)) * (width - 2 * padding);
  };

  // 라인 경로 생성
  const createLinePath = (seriesData: DataPoint[]) => {
    return seriesData.map((point, index) => {
      const x = getXScale(index);
      const y = getYScale(point.value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
  };

  // 포인트 렌더링
  const renderDataPoints = (seriesData: DataPoint[], color: string, seriesIndex: number) => {
    return seriesData.map((point, pointIndex) => (
      <circle
        key={`point-${seriesIndex}-${pointIndex}`}
        cx={getXScale(pointIndex)}
        cy={getYScale(point.value)}
        r="5"
        fill={color}
        onMouseEnter={() => setHoveredPoint({ seriesIndex, pointIndex })}
        onMouseLeave={() => setHoveredPoint(null)}
      />
    ));
  };

  return (
    <svg width={width} height={height}>
      {title && <text x={width/2} y={30} textAnchor="middle" fontSize="20">{title}</text>}
      
      {/* X, Y 축 그리기 */}
      <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="black" />
      <line x1={padding} y1={padding} x2={padding} y2={height-padding} stroke="black" />

      {/* 그리드 라인 */}
      {[...Array(5)].map((_, i) => {
        const y = padding + i * ((height - 2 * padding) / 4);
        return (
          <line 
            key={`grid-${i}`} 
            x1={padding} 
            y1={y} 
            x2={width-padding} 
            y2={y} 
            stroke="#e0e0e0" 
            strokeDasharray="4 4" 
          />
        );
      })}

      {/* 멀티 라인 렌더링 */}
      {series.map((series, seriesIndex) => {
        const color = series.color || `hsl(${seriesIndex * 60}, 70%, 50%)`;
        return (
          <React.Fragment key={`series-${seriesIndex}`}>
            <path
              d={createLinePath(series.data)}
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
            {renderDataPoints(series.data, color, seriesIndex)}
          </React.Fragment>
        );
      })}

      {/* 툴팁 */}
      {hoveredPoint && (
        <g transform={`translate(${getXScale(hoveredPoint.pointIndex)}, ${getYScale(series[hoveredPoint.seriesIndex].data[hoveredPoint.pointIndex].value)})`}>
          <circle r="8" fill="rgba(0,0,0,0.7)" />
          <text 
            x="10" 
            y="-10" 
            fill="black" 
            fontSize="12"
          >
            {series[hoveredPoint.seriesIndex].data[hoveredPoint.pointIndex].value}
          </text>
        </g>
      )}
    </svg>
  );
};

export default MultiLineChart;

// 사용 예시
const ExampleComponent = () => {
  const seriesData = [
    {
      label: 'Series 1',
      data: [
        { label: 'Jan', value: 10 },
        { label: 'Feb', value: 15 },
        { label: 'Mar', value: 13 }
      ]
    },
    {
      label: 'Series 2', 
      data: [
        { label: 'Jan', value: 5 },
        { label: 'Feb', value: 8 },
        { label: 'Mar', value: 12 }
      ],
      color: 'red'
    }
  ];

  return <MultiLineChart series={seriesData} title="Example Multi-Line Chart" />;
};