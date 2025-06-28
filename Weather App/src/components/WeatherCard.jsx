import React from "react";

const WeatherCard = ({ city, weather }) => {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl text-center">
      <h1 className="text-3xl font-bold mb-2">{city || "Your City"}</h1>
      <div className={`text-7xl ${weather.animation}`}>{weather.icon}</div>
      <div className="text-lg font-medium mt-2">{weather.condition}</div>
      <div className="text-4xl font-extrabold">{weather.temp}</div>
    </div>
  );
};

export default WeatherCard;
