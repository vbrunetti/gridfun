import rawSpark from "@/content/secondary-spark-snapshot.json";
import rawVariant from "@/content/secondary-background.json";
import {
  createDefaultSecondarySparkSnapshot,
  isSecondarySparkSnapshot,
  type SecondarySparkSnapshot,
} from "@/lib/secondary-spark-snapshot";

export type SecondaryBackgroundVariant = "aurora" | "spark";

function loadSparkSnapshot(): SecondarySparkSnapshot {
  if (isSecondarySparkSnapshot(rawSpark)) return rawSpark;
  return createDefaultSecondarySparkSnapshot();
}

function loadVariant(): SecondaryBackgroundVariant {
  const value = (rawVariant as { variant?: string }).variant;
  return value === "spark" ? "spark" : "aurora";
}

/** Which secondary background is active on the home page. */
export const SECONDARY_BACKGROUND_VARIANT = loadVariant();

export const SECONDARY_SPARK_SNAPSHOT = loadSparkSnapshot();
export const SECONDARY_SPARK_PRESET = SECONDARY_SPARK_SNAPSHOT.preset;
export const SECONDARY_SPARK_COLOR = SECONDARY_SPARK_SNAPSHOT.color;
