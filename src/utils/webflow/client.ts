import { WebflowClient } from "webflow-api";

export function createWebflowClient(accessToken: string) {
  return new WebflowClient({ accessToken });
}

// Track rate limit state
const rateLimitState = {
  remaining: 60, // Default rate limit
  resetTime: Date.now() + 60000, // Default reset time (1 minute)
  minDelay: 500, // Minimum delay between requests (ms)
  maxDelay: 5000, // Maximum delay between requests (ms)
  currentDelay: 500, // Current adaptive delay
  backoffMultiplier: 1.5, // Multiplier for exponential backoff
  maxRetries: 3, // Maximum number of retries for rate limit errors
};

/**
 * Updates rate limit state based on API response headers
 */
const updateRateLimitState = (headers: Headers) => {
  const remaining = parseInt(headers.get("x-ratelimit-remaining") || "60", 10);
  const resetTime = parseInt(headers.get("x-ratelimit-reset") || "60000", 10);

  rateLimitState.remaining = remaining;
  rateLimitState.resetTime = resetTime;

  // Adjust delay based on remaining quota
  if (remaining < 10) {
    rateLimitState.currentDelay = Math.min(
      rateLimitState.maxDelay,
      rateLimitState.currentDelay * rateLimitState.backoffMultiplier
    );
  } else if (remaining > 30) {
    rateLimitState.currentDelay = Math.max(
      rateLimitState.minDelay,
      rateLimitState.currentDelay / rateLimitState.backoffMultiplier
    );
  }
};

/**
 * Calculates delay needed before next request
 */
const calculateDelay = () => {
  if (rateLimitState.remaining <= 0) {
    const now = Date.now();
    if (rateLimitState.resetTime > now) {
      return rateLimitState.resetTime - now + 1000; // Add 1 second buffer
    }
  }
  return rateLimitState.currentDelay;
};

/**
 * Delays execution for specified milliseconds
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wraps API calls with rate limiting and retry logic
 */
export const withRateLimit = async <T>(
  apiCall: () => Promise<T>,
  retryCount = 0
): Promise<T> => {
  try {
    // Wait for appropriate delay before making request
    const delayMs = calculateDelay();
    if (delayMs > 0) {
      if (import.meta.env.DEV) console.debug(`Rate limit delay: ${delayMs}ms`);
      await delay(delayMs);
    }

    const response = await apiCall();

    // Update rate limit state if response has headers
    if (response && typeof response === "object" && "headers" in response) {
      updateRateLimitState(response.headers as Headers);
    }

    return response;
  } catch (error) {
    // Handle rate limit errors with exponential backoff
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      error.statusCode === 429 &&
      retryCount < rateLimitState.maxRetries
    ) {
      const backoffDelay = Math.min(
        rateLimitState.maxDelay,
        rateLimitState.currentDelay *
          Math.pow(rateLimitState.backoffMultiplier, retryCount + 1)
      );

      console.warn(
        `Rate limit exceeded, retrying in ${backoffDelay}ms (attempt ${
          retryCount + 1
        }/${rateLimitState.maxRetries})`
      );

      await delay(backoffDelay);
      return withRateLimit(apiCall, retryCount + 1);
    }

    throw error;
  }
};

export const fetchAllPages = async (
  webflowClient: any, // Use correct type if available
  siteId: string
): Promise<any[]> => {
  let allPages: any[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await webflowClient.pages.list(siteId, { offset });
    if (!response.pages || response.pages.length === 0) break;
    allPages = allPages.concat(response.pages);
    offset += response.pages.length;
    hasMore =
      response.pages.length > 0 && (response.pagination?.total ?? 0) > offset;
  }

  return allPages;
};
