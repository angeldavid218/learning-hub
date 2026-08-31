import { type Metadata } from "next";
import { notFound } from "next/navigation";

import {
  findLesson,
  PLACEHOLDER_CATALOG,
} from "../../_data/mock-catalog";
import { LessonHero } from "../../_components/lesson-hero";
import { LessonCompleteButton } from "../../_components/lesson-complete-button";

interface LessonPageProps extends PageProps<"/lessons/[lessonSlug]"> {}

export const generateMetadata = async ({
  params,
}: LessonPageProps): Promise<Metadata> => {
  const { lessonSlug } = await params;
  const match = findLesson(PLACEHOLDER_CATALOG, lessonSlug);

  return {
    title: match?.lesson.title ?? "Lesson",
  };
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonSlug } = await params;
  const match = findLesson(PLACEHOLDER_CATALOG, lessonSlug);

  if (!match) {
    notFound();
  }

  const { lesson, module } = match;

  return (
    <article className="card mx-auto w-full max-w-4xl border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-6 p-6 md:p-8">
        <header className="flex items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-base-content md:text-3xl">
            {lesson.title}
          </h1>
          <LessonCompleteButton />
        </header>

        <LessonHero
          moduleTitle={module.title}
          lessonTitle={lesson.title}
          lessonSlug={lesson.slug}
        />

        <div className="space-y-4 text-base leading-relaxed text-base-content/90">
          {lesson.slug === "your-first-7-days" ? (
            <YourFirstSevenDaysContent />
          ) : (
            <PlaceholderLessonContent title={lesson.title} />
          )}
        </div>
      </div>
    </article>
  );
};

const YourFirstSevenDaysContent = () => (
  <>
    <p>
      Welcome to your first week. Complete each day in order — each step builds
      on the last and sets you up for the modules ahead.
    </p>

    <h2 className="font-display mt-8 text-lg font-semibold text-base-content">
      Day 01 — Get oriented
    </h2>
    <ul className="mt-3 list-disc space-y-2 pl-5">
      <li>Watch the welcome overview in the community hub</li>
      <li>Introduce yourself in the cohort channel</li>
      <li>Review the course map in the sidebar</li>
    </ul>

    <h2 className="font-display mt-8 text-lg font-semibold text-base-content">
      Day 02 — Set up your tools
    </h2>
    <ul className="mt-3 list-disc space-y-2 pl-5">
      <li>Create your AI workspace accounts</li>
      <li>Install the recommended browser extensions</li>
      <li>Save your login credentials securely</li>
    </ul>

    <h2 className="font-display mt-8 text-lg font-semibold text-base-content">
      Day 03 — Define your niche
    </h2>
    <ul className="mt-3 list-disc space-y-2 pl-5">
      <li>Draft a one-sentence positioning statement</li>
      <li>List three content topics you can speak to with authority</li>
      <li>Share your draft for cohort feedback</li>
    </ul>
  </>
);

const PlaceholderLessonContent = ({ title }: { title: string }) => (
  <>
    <p>
      This lesson is part of the course skeleton. Content for{" "}
      <strong>{title}</strong> will be added as the catalog is wired to the
      database.
    </p>
    <p className="mt-4 text-base-content/70">
      Use the sidebar to explore other modules and lessons in the program.
    </p>
  </>
);
