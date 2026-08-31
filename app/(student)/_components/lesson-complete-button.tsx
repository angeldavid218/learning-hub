"use client";

import { useState } from "react";

export const LessonCompleteButton = () => {
  const [completed, setCompleted] = useState(false);

  return (
    <button
      type="button"
      className={`btn btn-circle btn-sm shrink-0 ${
        completed ? "btn-primary" : "btn-ghost border border-base-300"
      }`}
      aria-label={completed ? "Mark lesson incomplete" : "Mark lesson complete"}
      aria-pressed={completed}
      onClick={() => setCompleted((value) => !value)}
    >
      {completed ? <CheckIcon /> : <CircleIcon />}
    </button>
  );
};

const CheckIcon = () => (
  <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CircleIcon = () => (
  <svg
    className="size-4 text-base-content/40"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="7" />
  </svg>
);
