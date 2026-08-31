import Link from "next/link";

import type { CourseCatalog } from "../_data/mock-catalog";

interface CourseSidebarProps {
  catalog: CourseCatalog;
  activeLessonSlug: string | null;
  defaultOpenModuleId: string | null;
}

export const CourseSidebar = ({
  catalog,
  activeLessonSlug,
  defaultOpenModuleId,
}: CourseSidebarProps) => {
  return (
    <aside className="flex min-h-0 flex-1 flex-col border-r border-base-300">
      <div className="border-b border-base-300 p-5">
        <p className="font-display text-base font-semibold leading-snug text-base-content">
          {catalog.challengeTitle}
        </p>
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-base-content/60">
            <span>Progress</span>
            <span>{catalog.progressPercent}%</span>
          </div>
          <progress
            className="progress progress-primary h-1.5 w-full"
            value={catalog.progressPercent}
            max={100}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Course modules">
        <ul className="flex flex-col gap-1">
          {catalog.modules.map((module, index) => {
            const isOpen = module.id === defaultOpenModuleId;
            const moduleNumber = index + 1;

            return (
              <li key={module.id}>
                <details className="group" open={isOpen}>
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-base-content hover:bg-base-200 [&::-webkit-details-marker]:hidden">
                    <span>
                      {moduleNumber}. {module.title}
                    </span>
                    <ChevronIcon className="size-4 shrink-0 text-base-content/50 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="mb-2 ml-1 flex flex-col gap-0.5 border-l border-base-300 pl-3">
                    {module.lessons.map((lesson) => {
                      const isActive = lesson.slug === activeLessonSlug;

                      return (
                        <li key={lesson.slug}>
                          <Link
                            href={`/lessons/${lesson.slug}`}
                            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                              isActive
                                ? "bg-primary/15 font-medium text-primary"
                                : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                          >
                            {lesson.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
      clipRule="evenodd"
    />
  </svg>
);
