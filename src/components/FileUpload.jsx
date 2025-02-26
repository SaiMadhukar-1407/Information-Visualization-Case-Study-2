import React from "react";

const FileUpload = ({ onFileUpload }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <input
        type="file"
        accept=".csv"
        onChange={onFileUpload}
        className="mt-3 p-3 border border-gray-300 rounded-md shadow-md cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all"
      />
    </div>
  );
};

export default FileUpload;
