/* eslint-disable */
import React from 'react';
import './App.css';
import BarChart from './components/Chart/BarChart';
import { Option } from './types/Option';
import LineChart from './components/Chart/LineChart';

function App() {
  const sampleOption: Option = {
    type: 'bar',
    title: {
      text: 'Sample Chart',
      subTitle: 'Account',
      titleAlign: 'start',
    },
    data: [
      { label: 'adsf', value: 40 },
      { label: 'qewr', value: 20 },
      { label: 'C', value: 150 },
      { label: 'sdfg', value: 40 },
      { label: 'xvcb', value: 30 },
      { label: 'dfgh', value: 15 },
      { label: 'GGGG', value: 160 },
    ],
    layout: {
      width: 700,
      height: 500,
      padding: 15,
    },
    axis: {
      xAxis: {
        showSplitLine: true,
      },
      yAxis: {
        min: 0,
        max: 160,
        // fontSize: 16,
        // color: 'black',
        formatter: ''
      },
    },
    chartStyle: {
      color: "#5470C6"
    },
    tooltip: true,
    label:  {
      show: true,
      position: 'mid'
    }
  };

  return (
    <div>
      <h1>Sample Chart</h1>
      {/* 차트의 border 없애고, X,Y 축에 대한 컴포넌트들로 더 큰 바운더리 구현해야 함. */}
      {/* => ㄴㄴ. 그냥 단일 SVG로 구현하는 게 훨씬 좋음. */}

      <div className="chart-wrapper">
        <LineChart {...sampleOption}/>
      </div>
    </div>
  );
}

export default App;
