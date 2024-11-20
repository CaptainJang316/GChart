import type { Meta, StoryObj } from '@storybook/react';
import BarChartWrapper from './BarChartWrapper';
import BarChart from './BarChart';
import { darkenColor } from '../../utils/color';

const meta = {
  title: 'Components/Charts/BarChart',
  // component: BarChartWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // 이제 개별 속성에 대한 컨트롤이 가능
    width: {
      control: { type: 'number' },
      description: 'Chart width',
      table: {
        category: 'Layout',
      },
    },
    height: {
      control: { type: 'number' },
      description: 'Chart height',
      table: {
        category: 'Layout',
      },
    },
    color: {
      control: { type: 'color' },
      description: 'Bar color',
      table: {
        category: 'Style',
      },
    },
    hoverColor: {
      control: { type: 'color' },
      description: 'Bar hover color',
      table: {
        category: 'Style',
      },
    },
    titleAlign: {
      control: { type: 'select', options: ['start', 'middle', 'end'] },
      description: 'Title alignment',
      table: {
        category: 'Title',
      },
    },
    // ... 다른 속성들에 대한 컨트롤
  },
} satisfies Meta<typeof BarChartWrapper>;


export default meta;
type Story = StoryObj<typeof BarChart>;

const sampleData = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 200 },
  { label: 'Mar', value: 150 },
  { label: 'Apr', value: 180 },
  { label: 'May', value: 90 },
  { label: 'Jun', value: 220 }
];

export const Default: Story = {
  args: {
    type: 'bar',
    data: sampleData,
    layout: {
      width: 600,
      height: 400,
      padding: 20,
    },
    chartStyle: {
      color: '#4CAF50',
      hoverColor: '#3c8c40',
    },
    tooltip: true,
  },
};

// 다른 stories는 이전과 동일하게 유지...
export const WithTitle: Story = {
  args: {
    ...Default.args,
    title: {
      text: 'Monthly Sales',
      subTitle: 'Revenue',
      titleAlign: 'middle',
    },
  },
};

export const CustomAxis: Story = {
  args: {
    ...Default.args,
    axis: {
      xAxis: {
        showSplitLine: true,
      },
      yAxis: {
        min: 0,
        max: 250,
        fontSize: 12,
        color: '#666',
        formatter: 'K',
      },
    },
  },
};

export const CustomStyle: Story = {
  args: {
    ...Default.args,
    chartStyle: {
      color: '#2196F3',
      hoverColor: darkenColor('#2196F3', 0.2),
      unit: '$',
    },
    layout: {
      width: 800,
      height: 500,
      padding: 25,
    },
  },
};

export const SmallChart: Story = {
  args: {
    ...Default.args,
    layout: {
      width: 300,
      height: 200,
      padding: 10,
    },
    // data: sampleData.slice(0, 4),
  },
};

export const WithLabels: Story = {
  args: {
    ...Default.args,
    label: {
      show: true,
      fontSize: 12,
      position: 'top',
    },
  },
};