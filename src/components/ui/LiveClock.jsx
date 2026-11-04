import React, { useEffect, useState } from "react";

const LiveClock = ({ location = "Colombo" }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="text-right">
      <div className="text-2xl font-semibold tabular-nums">{time}</div>
      <div className="text-xs text-gray-500">
        {date} · {location}
      </div>
    </div>
  );
};

export default LiveClock;
