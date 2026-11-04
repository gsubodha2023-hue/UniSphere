import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/slices/taskSlice";

const typeColor = {
  Assignment: "bg-blue-500",
  Exam: "bg-red-500",
  Quiz: "bg-amber-500",
  "Personal Work": "bg-purple-500",
  Meeting: "bg-teal-500",
  Other: "bg-gray-500",
};

const CalendarPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.tasks);
  const [cursor, setCursor] = useState(new Date());

  useEffect(() => {
    dispatch(fetchTasks({}));
  }, [dispatch]);

  const { days, monthLabel } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

    return {
      days: cells,
      monthLabel: firstDay.toLocaleDateString([], {
        month: "long",
        year: "numeric",
      }),
    };
  }, [cursor]);

  const tasksByDate = useMemo(() => {
    const map = {};
    items.forEach((t) => {
      const key = new Date(t.dueDate).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm"
          >
            ← Prev
          </button>
          <span className="font-medium text-sm w-36 text-center">
            {monthLabel}
          </span>
          <button
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 font-medium px-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const key = day?.toDateString();
          const dayTasks = key ? tasksByDate[key] || [] : [];
          const isToday = day && day.toDateString() === new Date().toDateString();

          return (
            <div
              key={idx}
              className={`min-h-[90px] rounded-lg border p-2 text-xs ${
                day
                  ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  : "border-transparent"
              } ${isToday ? "ring-2 ring-primary-500" : ""}`}
            >
              {day && (
                <>
                  <div className="font-medium mb-1">{day.getDate()}</div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div
                        key={t._id}
                        className={`text-white rounded px-1 py-0.5 truncate ${
                          typeColor[t.type] || "bg-gray-500"
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-gray-400">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;
