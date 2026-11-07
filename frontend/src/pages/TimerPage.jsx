import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logSessionApi } from "../api/pomodoroApi";
import { fetchTasks } from "../redux/slices/taskSlice";

const FOCUS_MIN = 25;
const BREAK_MIN = 5;

const PomodoroTimer = () => {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            handleComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleComplete = async () => {
    setRunning(false);
    try {
      await logSessionApi({
        durationMinutes: mode === "focus" ? FOCUS_MIN : BREAK_MIN,
        type: mode,
      });
    } catch (e) {
      // fail silently in UI
    }
    const nextMode = mode === "focus" ? "break" : "focus";
    setMode(nextMode);
    setSecondsLeft((nextMode === "focus" ? FOCUS_MIN : BREAK_MIN) * 60);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft((mode === "focus" ? FOCUS_MIN : BREAK_MIN) * 60);
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
      <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
        {mode === "focus" ? "Focus Session" : "Break"}
      </p>
      <div className="text-6xl font-bold tabular-nums mb-6">
        {minutes}:{seconds}
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const CountdownWidget = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.tasks);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    dispatch(fetchTasks({ status: "Pending" }));
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, [dispatch]);

  const upcoming = [...items]
    .filter((t) => new Date(t.dueDate) > now)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const getCountdown = (dueDate) => {
    const diff = new Date(dueDate) - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    return { days, hours, mins };
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="font-semibold mb-4">Deadline Countdowns</h2>
      <div className="space-y-3">
        {upcoming.length === 0 && (
          <p className="text-sm text-gray-500">No upcoming deadlines.</p>
        )}
        {upcoming.map((t) => {
          const { days, hours, mins } = getCountdown(t.dueDate);
          return (
            <div key={t._id} className="flex items-center justify-between">
              <span className="text-sm font-medium">{t.title}</span>
              <span className="text-xs text-gray-500">
                {days}d {hours}h {mins}m
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TimerPage = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <PomodoroTimer />
    <CountdownWidget />
  </div>
);

export default TimerPage;
