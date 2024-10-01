import { useCallback, useMemo } from "react";
import { useSearchParams } from "./use-search-params";

export type UseToggleSearchParamOptions = {
  caseSensitive?: boolean;
  defaultValue?: boolean;
};

export function useToggleSearchParam(key: string, options?: UseToggleSearchParamOptions) {
  const { caseSensitive = false, defaultValue = false } = options ?? {};
  const [searchParams, setSearchParams] = useSearchParams();

  const value = useMemo(() => {
    if (!searchParams.has(key)) {
      return defaultValue;
    }
    if (caseSensitive) {
      return searchParams.get(key) === "true";
    }
    return searchParams.get(key)?.toLowerCase() === "true";
  }, [searchParams, defaultValue, key, caseSensitive]);

  const toggle = useCallback(
    (toggleValue?: boolean) => {
      const newValue = toggleValue !== undefined ? toggleValue : !value;
      setSearchParams((searchParams) => {
        searchParams.set(key, String(newValue))
      })
    },
    [value]
  );

  return [value, toggle] as const;

}