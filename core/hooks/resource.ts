import { useEffect, useState } from "react";
import { getResource } from "@/core/api";

interface Result<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches a single resource and tracks loading state.
 * Pass `null` as the URL to skip fetching (e.g. when a required param is not yet available).
 * Params are compared by value — no need to memoize the object at the call site.
 */
export function useResource<T>(
  url: string | null | undefined,
  params?: Record<string, string | number | boolean>,
): Result<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // JSON.stringify gives stable value-based comparison for the params object
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    getResource<T>(url, params ? { params } : undefined)
      .then((response) => setData(response.data))
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, serializedParams]);

  return { data, isLoading, error };
}
