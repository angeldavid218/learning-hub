export interface LessonItem {
  slug: string;
  title: string;
  completed?: boolean;
}

export interface ModuleItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

export interface CourseCatalog {
  challengeTitle: string;
  progressPercent: number;
  modules: ModuleItem[];
}

export const PLACEHOLDER_CATALOG: CourseCatalog = {
  challengeTitle: "The Content Marketing Agent System",
  progressPercent: 0,
  modules: [
    {
      id: "onboarding",
      title: "Onboarding",
      lessons: [
        { slug: "getting-started", title: "Getting Started" },
        {
          slug: "community-guidelines",
          title: "Community Guidelines & Culture",
        },
        { slug: "your-first-7-days", title: "Your First 7 Days" },
      ],
    },
    {
      id: "ai-setup",
      title: "AI Set-up",
      lessons: [
        { slug: "tooling-overview", title: "Tooling Overview" },
        { slug: "workspace-setup", title: "Workspace Setup" },
      ],
    },
    {
      id: "brand-guide",
      title: "Build Your Brand Guide",
      lessons: [
        { slug: "brand-voice", title: "Define Your Brand Voice" },
        { slug: "audience-profile", title: "Audience Profile" },
      ],
    },
    {
      id: "content-engine",
      title: "Build Your Content Engine",
      lessons: [
        { slug: "content-pillars", title: "Content Pillars" },
        { slug: "editorial-calendar", title: "Editorial Calendar" },
      ],
    },
    {
      id: "distribution",
      title: "Distribution & Growth",
      lessons: [
        { slug: "channel-strategy", title: "Channel Strategy" },
        { slug: "repurposing", title: "Repurposing Workflow" },
      ],
    },
    {
      id: "automation",
      title: "Agent Automation",
      lessons: [
        { slug: "agent-workflows", title: "Agent Workflows" },
        { slug: "quality-control", title: "Quality Control" },
      ],
    },
    {
      id: "scale",
      title: "Scale & Optimize",
      lessons: [
        { slug: "metrics", title: "Metrics That Matter" },
        { slug: "iteration", title: "Iterate & Improve" },
      ],
    },
  ],
};

export const DEFAULT_LESSON_SLUG = "your-first-7-days";

export const findLesson = (
  catalog: CourseCatalog,
  slug: string,
): { lesson: LessonItem; module: ModuleItem; moduleIndex: number } | null => {
  for (const [moduleIndex, module] of catalog.modules.entries()) {
    const lesson = module.lessons.find((item) => item.slug === slug);

    if (lesson) {
      return { lesson, module, moduleIndex };
    }
  }

  return null;
};

export const findModuleForLesson = (
  catalog: CourseCatalog,
  slug: string,
): string | null => findLesson(catalog, slug)?.module.id ?? null;
