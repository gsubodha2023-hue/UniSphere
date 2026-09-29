import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ui/ThemeToggle";
import Logo from "../assets/logo.png";

const features = [
  { icon: "✅", title: "Task Management", text: "Assignments, exams, quizzes — all tracked with priority and deadlines." },
  { icon: "📅", title: "Smart Calendar", text: "See every deadline laid out by day, week, or month." },
  { icon: "⏱️", title: "Focus Timer", text: "Built-in Pomodoro sessions to help you actually get work done." },
  { icon: "📝", title: "Notes", text: "Capture lecture notes and ideas, searchable and tagged." },
  { icon: "🔔", title: "Real-time Reminders", text: "Never miss a deadline with instant notifications." },
  { icon: "🌙", title: "Light & Dark Mode", text: "Study late without the glare, switch back for daytime clarity." },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="UniSphere logo" className="w-24 h-24" />
          <span className="font-semibold text-lg">UniSphere</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
            Log In
          </Link>
          <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white">
            Get Started
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-white/10 px-3 py-1 rounded-full">
            Built for University Students
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
            Your Academic Life,
            <br />
            <span className="text-primary-600 dark:text-primary-300">Finally Organized.</span>
          </h1>
          <p className="mt-4 text-gray-600 dark:text-white/70 text-lg">
            UniSphere brings your tasks, deadlines, notes, and study time into one calm, focused place.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link to="/register" className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium">
              Create Free Account
            </Link>
            <Link to="/login" className="px-6 py-3 rounded-lg border border-gray-300 dark:border-white/20 font-medium hover:bg-gray-50 dark:hover:bg-white/10">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          Everything you need, nothing you don't
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-white/60">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 dark:text-white/40 pb-8">
        UniSphere — Smart Student Productivity & Academic Life Management Platform
      </footer>
    </div>
  );
};

export default HomePage;