import { createSyncedPreferenceAtom } from "./synced-preference-atom";

export type TimelineDensity = "compact" | "comfy";

export const showTimelineTimestampsAtom = createSyncedPreferenceAtom(
  "timeline.showTimestamps",
);

export const timelineDensityAtom = createSyncedPreferenceAtom(
  "timeline.density",
);
