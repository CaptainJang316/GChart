import React from 'react';
import BarChart from './BarChart';
import type { Option, TitleAlign } from '../../types/Option';

type BarChartWrapperProps = {
  // 기본 데이터
  type: string;
  data: Array<{ label: string; value: number }>;
  // Layout props
  width: number;
  height: number;
  padding?: number;
  axisCnt?: number;
  // Style props
  color: string;
  hoverColor?: string;
  animation?: string;
  unit?: string;
  // Axis props
  showXAxisSplitLine?: boolean;
  xAxisLabelRotate?: number;
  yAxisMin?: number;
  yAxisMax?: number;
  yAxisFontSize?: number;
  yAxisColor?: string;
  yAxisFormatter?: string;
  // Title props
  titleText?: string;
  titleSubTitle?: string;
  titleAlign?: TitleAlign;
  // Others
  tooltip?: boolean;
  labelShow?: boolean;
  labelFontSize?: number;
  labelPosition?: string;
}

const BarChartWrapper: React.FC<BarChartWrapperProps> = ({
  type,
  data,
  width,
  height,
  padding = 15,
  color,
  hoverColor,
  titleText,
  titleSubTitle,
  titleAlign,
  // ... other props
}) => {
  const options: Option = {
    type,
    data,
    layout: {
      width,
      height,
      padding,
    },
    chartStyle: {
      color,
      hoverColor,
    },
    ...(titleText && {
      title: {
        text: titleText,
        subTitle: titleSubTitle,
        titleAlign,
      },
    }),
    // ... rest of the conversion
  };

  return <BarChart {...options} />;
};

export default BarChartWrapper;