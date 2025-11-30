import type {
  ExposureConfig,
  ExposedCollection,
  WebflowCollectionField,
} from "../types";
import rawConfig from "../config/collections.json";

const config = rawConfig as ExposureConfig;

let exposureSettings: {
  collections: Record<
    string,
    {
      id: string;
      displayName?: string;
      description?: string;
      isVisible?: boolean;
      fields: Record<
        string,
        {
          include: boolean;
          displayName?: string;
          description?: string;
        }
      >;
    }
  >;
} = { collections: {} };

/**
 * Updates the exposure settings
 */
export async function loadExposureSettings(kv: any) {
  console.log("[Exposure] Loading settings:", {
    hasKV: !!kv,
    kvType: typeof kv,
    kvMethods: kv ? Object.keys(kv) : [],
  });

  try {
    const rawSettings = await kv.get("settings");
    console.log("[Exposure] Raw settings result:", {
      hasSettings: !!rawSettings,
      settingsType: typeof rawSettings,
    });

    exposureSettings = {
      collections:
        typeof rawSettings === "string"
          ? (JSON.parse(rawSettings) as { collections: Record<string, any> })
              .collections || {}
          : rawSettings && typeof rawSettings === "object"
          ? (rawSettings as { collections?: Record<string, any> })
              .collections || {}
          : {},
    };

    console.log("[Exposure] Parsed settings:", {
      hasCollections: !!exposureSettings.collections,
      collectionCount: Object.keys(exposureSettings.collections).length,
    });
  } catch (error) {
    console.error("[Exposure] Error loading settings:", {
      error: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    exposureSettings = { collections: {} };
  }
}

/**
 * Check if a collection should be exposed in the documentation
 */
export function isCollectionExposed(collectionId: string): boolean {
  return !!exposureSettings.collections[collectionId]?.isVisible;
}

/**
 * Get the exposure configuration for a collection
 */
export function getCollectionConfig(collectionId: string) {
  return exposureSettings.collections[collectionId];
}

/**
 * Check if a field should be exposed for a given collection
 */
export function isFieldExposed(
  collectionId: string,
  fieldSlug: string
): boolean {
  const collection = exposureSettings.collections[collectionId];
  if (!collection) return false;
  return collection.fields[fieldSlug]?.include ?? false;
}

/**
 * Get display name for a field if configured, otherwise return the original name
 */
export function getFieldDisplayName(
  collectionId: string,
  fieldSlug: string,
  originalName: string
): string {
  const collection = exposureSettings.collections[collectionId];
  if (!collection) return originalName;
  return collection.fields[fieldSlug]?.displayName ?? originalName;
}

/**
 * Filter collection fields based on exposure configuration
 */
export function filterExposedFields(
  collectionId: string,
  fieldMap: Map<string, WebflowCollectionField>
): Map<string, WebflowCollectionField> {
  const config = exposureSettings.collections[collectionId];
  if (!config) return new Map();

  const exposedFields = new Map<string, WebflowCollectionField>();
  for (const [fieldSlug, field] of fieldMap.entries()) {
    const fieldConfig = config.fields[field.id];
    if (fieldConfig?.include) {
      // Create a copy of the field with potentially overridden display name
      const exposedField = {
        ...field,
        displayName: fieldConfig.displayName || field.displayName,
        description: fieldConfig.description || "",
      };
      exposedFields.set(fieldSlug, exposedField);
    }
  }
  return exposedFields;
}

/**
 * Filter item data based on exposure configuration
 */
export function filterExposedItemData(
  collectionId: string,
  itemData: Record<string, any>
): Record<string, any> {
  const config = exposureSettings.collections[collectionId];
  if (!config) return {};

  const exposedData: Record<string, any> = {};
  for (const [fieldSlug, value] of Object.entries(itemData)) {
    // Find the field config by matching against all field configs
    const fieldConfig = Object.entries(config.fields).find(
      ([_, cfg]) => cfg.include && fieldSlug === fieldSlug
    );

    if (fieldConfig) {
      exposedData[fieldSlug] = value;
    }
  }
  return exposedData;
}
