/**
 * Utility function to get the base URL for the application
 */
export const getBaseUrl = () => {
  return "";
};

/**
 * Utility function to create a URL with the base path
 */
export const createUrl = (path: string) => {
  const base = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${cleanPath}` : cleanPath;
};
