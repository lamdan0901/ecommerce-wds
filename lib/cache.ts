import { cache as reactCache } from "react";
import { unstable_cache as nextCache } from "next/cache";

type Callback = (...args: any[]) => Promise<any>;

export function cache<T extends Callback>(
  cb: T,
  keyParts: string[], // the keys to identify the cache value
  options: {
    revalidate?: number | false;
    tags?: string[];
  } = {}
) {
  return nextCache(reactCache(cb), keyParts, options);
}
