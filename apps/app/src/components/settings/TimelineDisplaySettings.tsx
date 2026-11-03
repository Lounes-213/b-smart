import { Switch } from "@bb/shared-ui/switch";
import { useAtom } from "jotai";
import { SettingsWithControl } from "@/components/ui/settings-section";
import {
  showTimelineTimestampsAtom,
  timelineDensityAtom,
  type TimelineDensity,
} from "@/lib/ui-preferences/timeline-preferences";
import { ChoiceDropdownSetting } from "./ChoiceDropdownSetting";

const TIMESTAMP_SETTING_LABEL = "Message timestamps";

const DENSITY_OPTIONS = [
  {
    key: "comfy",
    title: "Comfy",
    description: "BB's default spacing between messages.",
  },
  {
    key: "compact",
    title: "Compact",
    description: "Tighter spacing that fits more of the conversation on screen.",
  },
] as const satisfies readonly {
  key: TimelineDensity;
  title: string;
  description: string;
}[];

function isTimelineDensity(value: string): value is TimelineDensity {
  return value === "compact" || value === "comfy";
}

export function TimelineDisplaySettings() {
  const [showTimestamps, setShowTimestamps] = useAtom(
    showTimelineTimestampsAtom,
  );
  const [density, setDensity] = useAtom(timelineDensityAtom);
  const selectedDensity =
    DENSITY_OPTIONS.find((option) => option.key === density) ??
    DENSITY_OPTIONS[0];

  return (
    <>
      <SettingsWithControl
        label={TIMESTAMP_SETTING_LABEL}
        description="Show the time each message was sent beside its actions."
      >
        <Switch
          checked={showTimestamps}
          onCheckedChange={setShowTimestamps}
          aria-label={TIMESTAMP_SETTING_LABEL}
        />
      </SettingsWithControl>
      <ChoiceDropdownSetting
        label="Message spacing"
        triggerAriaLabel="Message spacing"
        description="How tightly messages stack in a thread's timeline."
        options={DENSITY_OPTIONS}
        selected={selectedDensity}
        onSelect={(key) => {
          if (isTimelineDensity(key)) {
            setDensity(key);
          }
        }}
      />
    </>
  );
}
