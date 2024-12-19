export interface Option {
  type: string;
  data: SingleBarData | MultiBarData | LineData;
  layout: Layout;
  chartStyle: ChartStyle;
  axis?: {
    xAxis?: XAxis;
    yAxis?: YAxis;
  };
  title?: Title;
  tooltip?: boolean;
  label?: Label;
}

export interface SingleBarChartProps extends Option {
  data: SingleBarData;
}

export interface MultiBarChartProps extends Option {
  data: MultiBarData;
  chartStyle: LineChartStyle;
}

export interface LineChartProps extends Option {
  data: LineData;
  chartStyle: LineChartStyle;
}

export type SingleBarData = {
  xLabel: string[];
  value: number[];
};

export type MultiBarData = {
  xLabel: string[];
  data: MultiData[];
};

export type LineData = {
  xLabel: string[];
  data: MultiData[];
};

export type MultiData = {
  name: string;
  value: number[];
  color: string;
  hoverColor?: string;
};

export type TitleAlign = "start" | "middle" | "end";
type LineStyle = "solid" | "smooth";

export interface Title {
  text: string;
  subTitle?: string;
  titleAlign?: TitleAlign;
}

export interface Layout {
  width: number;
  height: number;
  padding?: number;
  axisCnt?: number;
}

export interface XAxis {
  boundaryGap?: boolean;
  showSplitLine?: boolean;
  axisLabel?: {
    rotate: number;
  };
}

export interface YAxis {
  min?: number;
  max?: number;
  fontSize?: number;
  color?: string;
  formatter?: string;
}

export interface ChartStyle {
  color?: string;
  hoverColor?: string;
  animation?: string;
  unit?: string;
  fillArea?: boolean;
}

export interface LineChartStyle
  extends Omit<ChartStyle, "color" | "hoverColor"> {
  lineStyle: LineStyle;
  animation?: string;
  unit?: string;
  fillArea?: boolean;
}

export interface Label {
  show: boolean;
  fontSize?: number;
  position?: string;
}

// 파이 차트 전용 타입 정의
export interface PieChartProps extends Omit<Option, "data" | "axis"> {
  data: PieData;
  chartStyle: PieChartStyle;
}

export type PieData = {
  labels: string[];
  values: number[];
  colors: string[];
};

export interface PieChartStyle extends Omit<ChartStyle, "animation"> {
  innerRadius?: number; // 도넛 차트를 위한 내부 반지름
  startAngle?: number; // 시작 각도
  padAngle?: number; // 조각 사이 간격
}
