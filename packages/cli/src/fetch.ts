import { downloadTemplate } from "giget";
import { DEFAULT_TEMPLATE_REPO } from "./constants.js";

export type FetchOptions = {
  ref: string;
  dir: string;
  force?: boolean;
  forceClean?: boolean;
};

export type FetchResult = {
  source: string;
  dir: string;
};

export async function fetchTemplate({
  ref,
  dir,
  force = false,
  forceClean = false,
}: FetchOptions): Promise<FetchResult> {
  const source = `${DEFAULT_TEMPLATE_REPO}#${ref}`;

  const result = await downloadTemplate(source, {
    dir,
    force,
    forceClean,
    preferOffline: false,
  });

  return { source, dir: result.dir };
}
