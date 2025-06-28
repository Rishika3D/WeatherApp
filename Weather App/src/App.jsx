import { useState } from "react";

const KEY = import.meta.env.VITE_API_KEY;

export default function App() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [daily, setDaily] = useState([]);
  const [error, setError] = useState(null);

  const handleCityChange = async (e) => {
    const val = e.target.value;
    setCity(val);
    if (val.length > 2) {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=7&appid=${KEY}`
      );
      const data = await res.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  const fetchWeather = async (lat, lon, name) => {
    try {
      setError(null);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric`
      );
      const data = await res.json();
      setWeather({ city: name, ...data.list[0] });

      const dailyMap = {};
      data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyMap[date]) dailyMap[date] = item;
      });

      let days = Object.values(dailyMap).slice(0, 8);
      while (days.length < 8) {
        days.push(null);
      }
      setDaily(days);
    } catch {
      setError("Failed to fetch weather");
    }
  };

  const selectCity = (s) => {
    setCity(s.name);
    setSuggestions([]);
    fetchWeather(s.lat, s.lon, s.name);
  };

  const iconEmoji = (main, size = "text-6xl", withGlow = false) => {
    const common = `${size} relative z-10`;
    const glow = (
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500 opacity-30 blur-2xl"></div>
    );

    const rainLines = (
      <div className="absolute bottom-0 flex gap-0.5 mt-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-0.5 h-4 bg-blue-300 animate-raindrop`}
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
      </div>
    );

    const emojiWrap = (emoji, animClass, extra = null) => (
      <div className="relative flex flex-col items-center justify-center">
        {withGlow && glow}
        <span className={`${common} ${animClass}`}>{emoji}</span>
        {extra}
      </div>
    );

    switch (main) {
      case "Clear":
        return emojiWrap("☀️", "animate-slow-spin");
      case "Clouds":
        return emojiWrap("☁️", "animate-cloud");
        case "Rain":
          if (size === "text-9xl") {
            return (
              <div className="relative flex flex-col items-center justify-center">
                {withGlow && glow}
                <span className={`${common}`}>☁️</span>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-blue-300 animate-raindrop"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                  <div
                    className="w-2 h-6 bg-blue-400 animate-raindrop"
                    style={{ animationDelay: `0.2s` }}
                  ></div>
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i + 3}
                      className="w-1 h-4 bg-blue-300 animate-raindrop"
                      style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            );
          } else {
            return (
              <div className="relative flex flex-col items-center justify-center">
                <span className={`${common}`}>☁️</span>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 h-3 bg-blue-300 animate-raindrop"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            );
          }
          
          
      case "Snow":
        return emojiWrap("❄️", "animate-slow-spin");
      case "Thunderstorm":
        return emojiWrap("⛈️", "animate-shake");
      default:
        return emojiWrap("🌈", "");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-700 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Weather App 🌤️</h1>

      <div className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Enter city"
            className="w-full p-3 rounded-xl text-black border border-white/50 focus:border-white focus:ring-2 focus:ring-white transition"
          />
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white text-black rounded-xl mt-1 z-10">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  onClick={() => selectCity(s)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {s.name}, {s.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="text-red-300 mt-2">{error}</p>}

        {weather && (
          <div className="mt-6 bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col items-center gap-4 text-center">
            {iconEmoji(weather.weather[0].main, "text-9xl", true)}
            <div className="space-y-1">
              <p className="text-xl font-bold">{weather.city}</p>
              <p>Temp: {weather.main.temp}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
              <p className="capitalize">{weather.weather[0].description}</p>
            </div>
          </div>
        )}

        {daily.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {daily.map((day, idx) =>
              day ? (
                <div
                  key={idx}
                  className="bg-white/10 rounded-xl p-3 text-center shadow transition hover:bg-white/20"
                >
                  <p className="font-semibold">
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  {iconEmoji(day.weather[0].main, "text-6xl", false)}
                  <p className="font-bold">{day.main.temp}°C</p>
                </div>
              ) : (
                <div
                  key={idx}
                  className="bg-white/5 rounded-xl p-3 text-center shadow"
                >
                  <p className="opacity-50">N/A</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
