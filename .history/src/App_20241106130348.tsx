/* eslint-disable */
import React from 'react';
import './App.css';
import LineChart from './components/Chart/LineChart';

function App() {
  const chartOption = [
    data: [
      { label: 'Asdf', value: 10 },
      { label: 'zxcv', value: 20 },
      { label: 'qwer', value: 30 },
      { label: 'ASDF', value: 40 },
      { label: 'QWER', value: 50 },
      { label: 'dfgh', value: 15 },
      { label: 'gggg', value: 80 },
    ],
    type: 'line',
    data: [
      { label: 'Asdf', value: 10 },
      { label: 'zxcv', value: 20 },
      { label: 'qwer', value: 30 },
      { label: 'ASDF', value: 40 },
      { label: 'QWER', value: 50 },
      { label: 'dfgh', value: 15 },
      { label: 'gggg', value: 80 },
    ];
    width?: number;
    height?: number;
    axisCnt?: number;
    color?: string;
  ];

  return (
    <div>
      <h1>Sample Chart</h1>
      {/* 차트의 border 없애고, X,Y 축에 대한 컴포넌트들로 더 큰 바운더리 구현해야 함. */}
      {/* => ㄴㄴ. 그냥 단일 SVG로 구현하는 게 훨씬 좋음. */}
      <div className="chart-wrapper">
        <LineChart data={sampleData} width={800} height={600} color="green"/>
      </div>
    </div>
  );
}

export default App;