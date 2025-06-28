import React from "react";

const ForecastList = ({ forecast }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
      {forecast.map((day, idx) => (
        <div key={idx} className="bg-white/10 p-3 rounded-xl text-center shadow">
          <div className="font-semibold">{day.day}</div>
          <div className={`text-3xl ${day.animation}`}>{day.icon}</div>
          <div className="text-xs">{day.condition}</div>
          <div className="font-bold">{day.temp}</div>
        </div>
      ))}
    </div>
  );
};

export default ForecastList;
