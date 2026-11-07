import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markAllRead } from "../../redux/slices/notificationSlice";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { items } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) dispatch(markAllRead());
        }}
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        🔔
        {unread > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No notifications yet</p>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-gray-500">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
