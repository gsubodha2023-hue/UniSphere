import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTaskStats } from "../redux/slices/taskSlice";
import HomeBg from "../assets/homePageBg.jpg";
import Logo from "../assets/logo.png";

const StatCard = ({ label, value, color }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const TaskRow = ({ task }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <div>
      <img src={Logo} alt="UniSphere logo" className="w-16 h-16 inline-block mr-2" />
      <p className="text-sm font-medium">{task.title}</p>
      <p className="text-xs text-gray-500">
        {task.type} · {task.priority} priority
      </p>
    </div>
    <span className="text-xs text-gray-500">
      {new Date(task.dueDate).toLocaleDateString()}
    </span>
  </div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTaskStats());
  }, [dispatch]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HomeBg})` }}
      />
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

      <div className="relative z-10 space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Tasks" value={stats?.total ?? "—"} color="text-primary-600" />
          <StatCard label="Pending" value={stats?.pending ?? "—"} color="text-amber-500" />
          <StatCard label="In Progress" value={stats?.inProgress ?? "—"} color="text-blue-500" />
          <StatCard label="Completed" value={stats?.completed ?? "—"} color="text-green-500" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Upcoming Deadlines (7 days)</h2>
              <Link to="/tasks" className="text-xs text-primary-600">
                View all
              </Link>
            </div>
            {stats?.upcoming?.length ? (
              stats.upcoming.map((t) => <TaskRow key={t._id} task={t} />)
            ) : (
              <p className="text-sm text-gray-500">Nothing due soon. Nice work!</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-red-600">Overdue</h2>
              <Link to="/tasks" className="text-xs text-primary-600">
                View all
              </Link>
            </div>
            {stats?.overdue?.length ? (
              stats.overdue.map((t) => <TaskRow key={t._id} task={t} />)
            ) : (
              <p className="text-sm text-gray-500">No overdue tasks 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
