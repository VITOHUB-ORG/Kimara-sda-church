import { dictionaries, type Dictionary, type Lang } from "./dictionaries";

export type TFunction = (key: string, vars?: Record<string, string>) => string;

export function lookup<T = unknown>(dict: Dictionary, key: string): T {
  return key
    .split(".")
    .reduce<unknown>((acc, k) => {
      if (acc && typeof acc === "object" && k in (acc as object)) {
        return (acc as Record<string, unknown>)[k];
      }
      return undefined;
    }, dict) as T;
}

export function createT(dict: Dictionary): TFunction {
  return (key: string, vars?: Record<string, string>) => {
    const value = lookup(dict, key);
    let str = typeof value === "string" ? value : key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, v);
      }
    }
    return str;
  };
}

export { dictionaries, type Dictionary, type Lang };
