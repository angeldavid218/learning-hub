interface LessonHeroProps {
  moduleTitle: string;
  lessonTitle: string;
  lessonSlug: string;
}

export const LessonHero = ({
  moduleTitle,
  lessonTitle,
  lessonSlug,
}: LessonHeroProps) => {
  const accentNumber = lessonSlug === "your-first-7-days" ? "7" : null;

  return (
    <div className="relative overflow-hidden rounded-box border border-base-300 bg-base-200 p-6 md:p-8">
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          {moduleTitle} · Module
        </p>
        <h2 className="font-display mt-3 max-w-lg text-3xl font-semibold leading-tight tracking-tight text-base-content md:text-4xl">
          {lessonTitle}
        </h2>
        <p className="mt-3 max-w-xl text-sm text-base-content/70">
          Build momentum with clear daily actions. Mark lessons complete as you
          go to track your progress through the program.
        </p>
      </div>
      {accentNumber ? (
        <span
          className="font-display pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 text-[7rem] font-bold leading-none text-base-content/5 md:text-[9rem]"
          aria-hidden="true"
        >
          {accentNumber}
        </span>
      ) : null}
    </div>
  );
};
