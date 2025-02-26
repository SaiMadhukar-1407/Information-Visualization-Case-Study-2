import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label } from "recharts";
import * as d3 from "d3";

const TrendPrediction = ({ rawData }) => {
  const [viewMode, setViewMode] = useState("daily");
  const [selectedWeather, setSelectedWeather] = useState("All");
  const [filteredData, setFilteredData] = useState([]);

  const weatherOptions = ["All", ...new Set(rawData.map((d) => d.weather))];

  useEffect(() => {
    let dataToUse = selectedWeather === "All" ? rawData : rawData.filter((d) => d.weather === selectedWeather);
    setFilteredData(dataToUse);
  }, [selectedWeather, rawData]);

  const processPredictionData = () => {
    if (filteredData.length === 0) return [];

    let groupedData;

    if (viewMode === "daily") {
      groupedData = d3.rollup(
        filteredData,
        (v) => d3.sum(v, (d) => d.numVisitors),
        (d) => d.date
      );
    } else if (viewMode === "weekly") {
      groupedData = d3.rollup(
        filteredData,
        (v) => d3.sum(v, (d) => d.numVisitors),
        (d) => d3.timeFormat("%Y-%W")(new Date(d.date))
      );
    } else if (viewMode === "monthly") {
      groupedData = d3.rollup(
        filteredData,
        (v) => d3.sum(v, (d) => d.numVisitors),
        (d) => d.date.substring(0, 7)
      );
    }

    let formattedData = Array.from(groupedData, ([key, value]) => ({
      date: key,
      visitors: value,
    }));

    formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    let windowSize = viewMode === "daily" ? 7 : viewMode === "weekly" ? 4 : 3;
    let predictionData = formattedData.map((d, i, arr) => {
      let prevDays = arr.slice(Math.max(0, i - windowSize), i + 1);
      return {
        date: d.date,
        visitors: d.visitors,
        prediction: prevDays.length > 0 ? d3.mean(prevDays, (p) => p.visitors) : d.visitors,
      };
    });

    return predictionData;
  };

  const predictionData = processPredictionData();

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white mt-4">
      <h2 className="text-lg font-semibold">Visitor Trend Prediction (Weather-Based)</h2>

      <div className="mb-4">
        <label htmlFor="weather" className="mr-2">Select Weather Condition:</label>
        <select
          id="weather"
          value={selectedWeather}
          onChange={(e) => setSelectedWeather(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {weatherOptions.map((weather, index) => (
            <option key={index} value={weather}>
              {weather}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setViewMode("daily")}>
          Daily
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={() => setViewMode("weekly")}>
          Weekly
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded" onClick={() => setViewMode("monthly")}>
          Monthly
        </button>
      </div>

      {predictionData.length === 0 ? (
        <p className="text-red-500">No prediction data available. Try re-uploading the file.</p>
      ) : (
        <LineChart width={800} height={400} data={predictionData}>
          <XAxis dataKey="date">
            <Label value="Date" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Predicted Visitors" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="visitors" stroke="#82ca9d" />
          <Line type="monotone" dataKey="prediction" stroke="#ff7300" />
        </LineChart>
      )}
    </div>
  );
};

export default TrendPrediction;
