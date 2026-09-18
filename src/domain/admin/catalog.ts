import { asc, eq } from "drizzle-orm";
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import {
  challenges,
  lessonContents,
  lessons,
  membershipTiers,
  modules,
} from "@/src/db/schema";

/**
 * Any Drizzle Postgres client. Typed against the driver-agnostic base so the
 * loaders take whatever the caller injects — the app client, a transaction, or
 * a test double — rather than importing `src/db/client` themselves.
 */
export type AdminDb = PgAsyncDatabase<PgQueryResultHKT>;

export type LessonContentType = (typeof lessonContents.$inferSelect)["type"];

export interface AdminChallenge {
  id: string;
  brandId: string;
  title: string;
  durationDays: number;
}

export interface AdminLessonContent {
  id: string;
  lessonId: string;
  type: LessonContentType;
  title: string | null;
  sortOrder: number;
  body: string | null;
  url: string | null;
  vimeoId: string | null;
  storagePath: string | null;
}

export interface AdminLesson {
  id: string;
  moduleId: string;
  title: string;
  sortOrder: number;
  contents: AdminLessonContent[];
}

export interface AdminModule {
  id: string;
  challengeId: string;
  title: string;
  sortOrder: number;
  /** Gating inputs, returned verbatim. Interpreting them is the access engine's job. */
  requiredTierId: string;
  requiredTierName: string;
  unlockOffset: number;
  lessons: AdminLesson[];
}

export interface AdminChallengeTree extends AdminChallenge {
  modules: AdminModule[];
}

/**
 * Every challenge owned by `brandId`. Challenges carry no sort_order, so they
 * come back by title for a stable listing.
 */
export const listChallengesForBrand = async (
  db: AdminDb,
  brandId: string,
): Promise<AdminChallenge[]> =>
  db
    .select({
      id: challenges.id,
      brandId: challenges.brandId,
      title: challenges.title,
      durationDays: challenges.durationDays,
    })
    .from(challenges)
    .where(eq(challenges.brandId, brandId))
    .orderBy(asc(challenges.title), asc(challenges.id));

/**
 * The full challenge → modules → lessons → contents tree for the admin view.
 *
 * Returns null when no challenge with `challengeId` belongs to `brandId`. A
 * challenge from another brand is indistinguishable from a missing one, so a
 * caller-supplied id can neither read across brands nor probe for existence.
 *
 * Four queries regardless of tree size: one per level, each filtered back to
 * the challenge through joins rather than per-parent lookups. Nesting is
 * assembled in memory. Every row is returned; nothing here filters on
 * publication state or applies gating.
 */
export const getChallengeTree = async (
  db: AdminDb,
  challengeId: string,
  brandId: string,
): Promise<AdminChallengeTree | null> => {
  const [challenge] = await db
    .select({
      id: challenges.id,
      brandId: challenges.brandId,
      title: challenges.title,
      durationDays: challenges.durationDays,
    })
    .from(challenges)
    .where(eq(challenges.id, challengeId))
    .limit(1);

  // Deliberate: a wrong-brand challenge and a missing id return the same
  // value, so a caller-supplied id cannot probe for existence across brands.
  if (!challenge || challenge.brandId !== brandId) {
    return null;
  }

  const moduleRows = await db
    .select({
      id: modules.id,
      challengeId: modules.challengeId,
      title: modules.title,
      sortOrder: modules.sortOrder,
      requiredTierId: modules.requiredTierId,
      requiredTierName: membershipTiers.name,
      unlockOffset: modules.unlockOffset,
    })
    .from(modules)
    .innerJoin(membershipTiers, eq(membershipTiers.id, modules.requiredTierId))
    .where(eq(modules.challengeId, challenge.id))
    .orderBy(asc(modules.sortOrder), asc(modules.id));

  const lessonRows = await db
    .select({
      id: lessons.id,
      moduleId: lessons.moduleId,
      title: lessons.title,
      sortOrder: lessons.sortOrder,
    })
    .from(lessons)
    .innerJoin(modules, eq(modules.id, lessons.moduleId))
    .where(eq(modules.challengeId, challenge.id))
    .orderBy(asc(lessons.sortOrder), asc(lessons.id));

  const contentRows = await db
    .select({
      id: lessonContents.id,
      lessonId: lessonContents.lessonId,
      type: lessonContents.type,
      title: lessonContents.title,
      sortOrder: lessonContents.sortOrder,
      body: lessonContents.body,
      url: lessonContents.url,
      vimeoId: lessonContents.vimeoId,
      storagePath: lessonContents.storagePath,
    })
    .from(lessonContents)
    .innerJoin(lessons, eq(lessons.id, lessonContents.lessonId))
    .innerJoin(modules, eq(modules.id, lessons.moduleId))
    .where(eq(modules.challengeId, challenge.id))
    .orderBy(asc(lessonContents.sortOrder), asc(lessonContents.id));

  // Rows arrive already ordered by sort_order, so grouping with push keeps
  // each child list in order without a second sort.
  const contentsByLesson = groupBy(contentRows, (row) => row.lessonId);
  const lessonsByModule = groupBy(
    lessonRows.map((lesson) => ({
      ...lesson,
      contents: contentsByLesson.get(lesson.id) ?? [],
    })),
    (lesson) => lesson.moduleId,
  );

  return {
    ...challenge,
    modules: moduleRows.map((module) => ({
      ...module,
      lessons: lessonsByModule.get(module.id) ?? [],
    })),
  };
};

const groupBy = <T>(rows: T[], keyOf: (row: T) => string): Map<string, T[]> => {
  const groups = new Map<string, T[]>();

  for (const row of rows) {
    const key = keyOf(row);
    const group = groups.get(key);

    if (group) {
      group.push(row);
    } else {
      groups.set(key, [row]);
    }
  }

  return groups;
};
