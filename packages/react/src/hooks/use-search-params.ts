import { atom } from "nanostores";
import { useStore } from "@nanostores/react";

function getSearchParams() {
  if (!globalThis.window) {
    return new URLSearchParams();
  }
  return new URLSearchParams(globalThis.window.location.search);
}

const searchParamStore = atom(getSearchParams());

export type SetSearchParamsFunction = (
  mutableSearchParams: URLSearchParams
) => URLSearchParams | void;

export type URLSearchParamsInit =
  | string
  | URLSearchParams
  | string[][]
  | Record<string, string>
  | undefined;

export function setSearchParams(
  arg: URLSearchParamsInit | SetSearchParamsFunction
) {
  let newValue: URLSearchParams;
  if (typeof arg === "function") {
    newValue = new URLSearchParams(searchParamStore.get());
    const returnedValue = arg(newValue);
    if (returnedValue instanceof URLSearchParams) {
      newValue = returnedValue;
    }
  } else {
    newValue = new URLSearchParams(arg);
  }

  searchParamStore.set(newValue);

  const url = new URL(globalThis.location.href);
  url.search = newValue.toString();
  globalThis.history.replaceState(null, "", url.toString());
}

export function useSearchParams() {
  const searchParams = useStore(searchParamStore);

  return [searchParams, setSearchParams] as const;
}
