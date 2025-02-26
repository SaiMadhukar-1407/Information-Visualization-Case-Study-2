import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label } from "recharts";
import * as d3 from "d3";

const VisitorTrends = ({ rawData }) => {
  const [viewMode, setViewMode] = useState("daily");

  const ensureAllMonthsIncluded = (data) => {
    const allMonths = Array.from({ length: 12 }, (_, i) => `2024-${String(i + 1).padStart(2, "0")}`);
    
    return allMonths.map((month) => {
      const existingData = data.find((d) => d.date === month);
      return existingData || { date: month, visitors: 0 };
    });
  };

  const processChartData = () => {
    let groupedData;

    if (viewMode === "daily") {
      groupedData = d3.rollup(
        rawData,
        (v) => d3.sum(v, (d) => d.numVisitors),
        (d) => d.date
      );
    } else if (viewMode === "weekly") {
      groupedData = d3.rollup(
        rawData,
        (v) => d3.sum(v, (d) => d.numVisitors),
        (d) => d3.timeFormat("%Y-%W")(new Date(d.date))
      );
    } else if (viewMode === "monthly") {
      groupedData = d3.rollup(
        rawData,
        (v) => d3.sum(v, (d) => d.numVisitors),
        (d) => d.date.substring(0, 7)
      );
    }

    let formattedData = Array.from(groupedData, ([key, value]) => ({
      date: key,
      visitors: value,
    }));

    if (viewMode === "monthly") {
      formattedData = ensureAllMonthsIncluded(formattedData);
    }

    return formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const chartData = processChartData();

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white text-black mt-4">
      <h2 className="text-lg font-semibold">Visitor Trends ({viewMode.charAt(0).toUpperCase() + viewMode.slice(1)})</h2>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setViewMode("daily")}>Daily</button>
        <button onClick={() => setViewMode("weekly")}>Weekly</button>
        <button onClick={() => setViewMode("monthly")}>Monthly</button>
      </div>

      <LineChart width={800} height={400} data={chartData}>
        <XAxis dataKey="date">
          <Label value="Date" offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Number of Visitors" angle={-90} position="insideLeft" />
        </YAxis>
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default VisitorTrends;
