import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import VisitorTrends from "./components/VisitorTrends";
import VisitorTypeChart from "./components/VisitorTypeChart";
import TrendPrediction from "./components/TrendPrediction";
import { parse } from "papaparse";
import * as d3 from "d3";

const App = () => {
  const [rawData, setRawData] = useState([]);
  const [visitorTypeData, setVisitorTypeData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data.map((row) => ({
            date: row["Date"],
            visitorType: row["Visitor Type"],
            numVisitors: row["Number of Visitors"],
            weather: row["Weather Condition"],
          }));

          setRawData(parsedData);
          processVisitorTypeData(parsedData);
        },
      });
    }
  };

  const processVisitorTypeData = (parsedData) => {
    if (parsedData.length === 0) return;

    const groupedByMonth = d3.rollup(
      parsedData,
      (v) => ({
        oneDay: d3.sum(v.filter((d) => d.visitorType === "One-day visit"), (d) => d.numVisitors),
        camping: d3.sum(v.filter((d) => d.visitorType === "Camping"), (d) => d.numVisitors),
        rvCenter: d3.sum(v.filter((d) => d.visitorType === "RV Center"), (d) => d.numVisitors),
      }),
      (d) => d.date.substring(0, 7)
    );

    const formattedData = Array.from(groupedByMonth, ([key, value]) => ({
      month: key,
      oneDay: value.oneDay || 0,
      camping: value.camping || 0,
      rvCenter: value.rvCenter || 0,
    }));

    setVisitorTypeData(formattedData);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-3xl bg-green-300 text-black py-6 text-center rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold">Draco National Park Dashboard</h1>
      </header>

      
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-400 to-white rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Upload Visitor Data (CSV)</h2>
        <FileUpload onFileUpload={handleFileUpload} />
        <p className="text-gray-500 mt-2">Upload a CSV file to display data.</p>
      </div>

      
      {rawData.length > 0 ? (
        <div className="w-full max-w-4xl mt-6">
          <VisitorTrends rawData={rawData} />
          <VisitorTypeChart visitorTypeData={visitorTypeData} />
          <TrendPrediction rawData={rawData} />
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No data uploaded yet.</p>
      )}
    </div>
  );
};

export default App;
