/* eslint-disable */
import React from 'react';
import './App.css';
import BarChart from './components/Chart/BarChart';
import { Option } from './types/Option';

function App() {
  const sampleOption: Option = {
    type: 'bar',
    title: {
      text: Sample Bar ChartArea,
    }
    data: [
      { label: 'A', value: 40 },
      { label: 'B', value: 20 },
      { label: 'C', value: 150 },
      { label: 'D', value: 40 },
      { label: 'E', value: 30 },
      { label: 'F', value: 15 },
      { label: 'G', value: 160 },
    ],
    layout: {
      width: 600,
      height: 400,
    },
    style: {
      color: "green"
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
        <BarChart {...sampleOption}/>
      </div>
    </div>
  );
}

export default App;
