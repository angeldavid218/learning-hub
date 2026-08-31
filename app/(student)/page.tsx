import { redirect } from "next/navigation";

import { DEFAULT_LESSON_SLUG } from "./_data/mock-catalog";

export default function StudentHomePage() {
  redirect(`/lessons/${DEFAULT_LESSON_SLUG}`);
}
