import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Label } from "recharts";

const VisitorTypeChart = ({ visitorTypeData }) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white mt-4">
      <h2 className="text-lg font-semibold">Visitor Type Analysis (Monthly)</h2>
      <BarChart width={800} height={400} data={visitorTypeData}>
        <XAxis dataKey="month">
          <Label value="Month" offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Number of Visitors" angle={-90} position="insideLeft" />
        </YAxis>
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="oneDay" stackId="a" fill="#e41a1c" />
        <Bar dataKey="camping" stackId="a" fill="#377eb8" />
        <Bar dataKey="rvCenter" stackId="a" fill="#4daf4a" />
      </BarChart>
    </div>
  );
};

export default VisitorTypeChart;
