// Re-export the client
export { delay, withRateLimit } from "./client";

// Re-export collections functionality
export {
  fetchCollections,
  fetchCollectionSchema,
  fetchAllCollectionItems,
} from "./collections";

// Re-export pages functionality
export { fetchAllPages, fetchAllPageContent } from "./pages";

// Re-export components functionality
export {
  fetchComponents,
  getComponentMetadata,
  fetchAllComponentContent,
} from "./components";
