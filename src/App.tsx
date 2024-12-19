/* eslint-disable */
import React from "react";
import "./App.css";
import BarChart from "./components/Chart/BarChart";
import {
  LineChartProps,
  PieChartProps,
  SingleBarChartProps,
} from "./types/Option";
import LineChart from "./components/Chart/LineChart";
import { xml } from "d3";
import PieChart from "./components/Chart/PieChart";

function App() {
  const lineOption: LineChartProps = {
    type: "bar",
    title: {
      text: "Sample Chart",
      subTitle: "Account",
      titleAlign: "start",
    },
    data: {
      xLabel: [
        "data1",
        "data2",
        "data3",
        "data4",
        "data5",
        "data6",
        "data7",
        "data8",
        "data9",
        "data10",
      ],
      // value: [40, 20, 150, 40, 50, 80, 110] // Bar
      data: [
        // line
        {
          name: "First",
          value: [30, 50, 150, 40, 35, 20, 21, 100, 10, 20],
          color: "red",
        },
        {
          name: "Second",
          value: [60, 80, 120, 20, 20, 40, 100, 40, 50, 80],
          color: "green",
        },
        {
          name: "Third",
          value: [80, 60, 20, 10, 90, 50, 150, 20, 40, 100],
          color: "#5470C6",
        },
      ],
    },
    layout: {
      width: 700,
      height: 500,
      padding: 15,
    },
    axis: {
      xAxis: {
        showSplitLine: true,
        boundaryGap: false,
      },
      yAxis: {
        min: 0,
        max: 160,
        // fontSize: 16,
        // color: 'black',
        formatter: "",
      },
    },
    chartStyle: {
      // color: "#5470C6",
      lineStyle: "smooth",
      fillArea: false,
    },
    tooltip: true,
    label: {
      show: true,
      position: "mid",
    },
  };

  const barOption: SingleBarChartProps = {
    type: "bar",
    title: {
      text: "Sample Chart",
      subTitle: "Account",
      titleAlign: "start",
    },
    data: {
      xLabel: ["data1", "data2", "data3", "data4", "data5", "data6", "data7"],
      value: [40, 20, 150, 40, 50, 80, 110], // Bar
      // data: [
      //   // line
      //   { name: "First", value: [40, 20, 150, 40, 50, 80, 110], color: "red" },
      //   {
      //     name: "Second",
      //     value: [60, 80, 120, 20, 20, 40, 100],
      //     color: "green",
      //   },
      //   {
      //     name: "Third",
      //     value: [80, 60, 20, 10, 90, 50, 150],
      //     color: "#5470C6",
      //   },
      // ],
    },
    layout: {
      width: 700,
      height: 500,
      padding: 15,
    },
    axis: {
      xAxis: {
        showSplitLine: true,
        boundaryGap: true,
      },
      yAxis: {
        min: 0,
        max: 160,
        // fontSize: 16,
        // color: 'black',
        formatter: "",
      },
    },
    chartStyle: {
      // color: "#5470C6",
      fillArea: false,
    },
    tooltip: true,
    label: {
      show: true,
      position: "mid",
    },
  };

  const pieOption: PieChartProps = {
    type: "pie",
    title: {
      text: "Sample Chart",
      subTitle: "Account",
      titleAlign: "start",
    },
    data: {
      labels: ["data1", "data2", "data3", "data4", "data5"],
      values: [20, 10, 30, 40, 50],
      colors: ["red", "blue", "green", "gold", "pink"],
    },
    layout: {
      width: 700,
      height: 500,
      padding: 15,
    },
    chartStyle: {
      innerRadius: 80, // 도넛 차트를 위한 내부 반지름
      startAngle: 0, // 시작 각도
      padAngle: 5,
    },
    tooltip: true,
    label: {
      show: true,
      position: "mid",
    },
  };

  return (
    <div>
      <h1>G-Chart</h1>
      {/* 차트의 border 없애고, X,Y 축에 대한 컴포넌트들로 더 큰 바운더리 구현해야 함. */}
      {/* => ㄴㄴ. 그냥 단일 SVG로 구현하는 게 훨씬 좋음. */}

      <div className="chart-wrapper">
        <LineChart {...lineOption} />
      </div>
      <div className="chart-wrapper">
        <BarChart {...barOption} />
      </div>
      <div className="chart-wrapper">
        <PieChart {...pieOption} />
      </div>
    </div>
  );
}

export default App;
