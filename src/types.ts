// Consolidated types for the project

// KV types
export interface KVNamespaceListKey {
  name: string;
  expiration?: number;
  metadata?: object;
}

export interface KVNamespaceListResult {
  keys: KVNamespaceListKey[];
  list_complete: boolean;
  cursor?: string;
  cacheStatus?: string | null;
}

export interface MinimalKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<KVNamespaceListResult>;
}

// Webflow types
export interface WebflowNode {
  id: string;
  type: string;
  text?: {
    html: string | null;
    text: string | null;
  };
  image?: {
    alt: string;
    assetId: string | null;
  };
  choices?: Array<{ value: string; text: string }>;
  placeholder?: string;
  value?: string;
  waitingText?: string;
  attributes?: Record<string, string>;
  componentId?: string;
  propertyOverrides?: Array<{
    propertyId: string;
    type: string;
    label: string;
    text?: {
      html: string | null;
      text: string | null;
    };
  }>;
  [key: string]: any;
}

export interface ComponentData {
  nodes: WebflowNode[];
  pagination?: WebflowPagination;
}

export interface PageMetadata {
  id: string;
  title: string;
  slug: string;
  description: string;
  last_updated: string;
}

export interface WebflowPagination {
  limit: number;
  offset: number;
  total: number;
}

export interface WebflowPage {
  id: string;
  siteId: string;
  title: string;
  slug: string;
  draft: boolean;
  archived: boolean;
  lastUpdated: string;
  createdOn: string;
  publishedPath?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  openGraph?: {
    title?: string;
    description?: string;
  };
}

export interface WebflowPagesResponse {
  pages: WebflowPage[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface ProcessedPage {
  id: string;
  content: string[];
  fileName: string;
  metadata?: PageMetadata;
}

export interface WebflowPageContentResponse {
  nodes: WebflowNode[];
  pagination: WebflowPagination;
}

export interface WebflowCollection {
  id: string;
  name: string;
  displayName: string;
  itemCount: number;
  fields: WebflowCollectionField[];
}

export interface WebflowCollectionItem {
  id: string;
  lastPublished: string;
  lastUpdated: string;
  createdOn: string;
  fieldData: Record<string, any>;
  cmsLocaleId: string;
  isArchived: boolean;
  isDraft: boolean;
  collectionName?: string;
}

export interface WebflowCollectionItemsResponse {
  items: WebflowCollectionItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface WebflowCollectionField {
  id: string;
  name: string;
  displayName: string;
  type: string;
  required: boolean;
  editable: boolean;
  validations: Record<string, any>;
}

export interface WebflowCollectionSchema {
  id: string;
  lastUpdated: string;
  createdOn: string;
  name: string;
  slug: string;
  singularName: string;
  fields: WebflowCollectionField[];
}

export interface WebflowCollectionsResponse {
  collections: WebflowCollection[];
}

export interface CollectionFieldExposure {
  displayName?: string;
  include: boolean;
  description?: string;
}

export interface ExposedCollection {
  id: string;
  displayName?: string;
  description?: string;
  fields: Record<string, CollectionFieldExposure>;
}

export interface ExposureConfig {
  collections: Record<
    string,
    {
      id: string;
      displayName?: string;
      description?: string;
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
}

export interface WebflowSite {
  id: string;
  displayName?: string;
  shortName?: string;
  previewUrl?: string;
  timezone?: string;
  createdOn: string;
  lastPublished?: string;
  database?: string;
}
