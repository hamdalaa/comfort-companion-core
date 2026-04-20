/**
 * Public backend base URL — points to the Lovable backend (Cloudflare tunnel
 * in dev, permanent URL in prod). All `/public/*` browser requests go here.
 * Falls back to same-origin if the env var is missing (e.g. legacy preview).
 */
export const PUBLIC_API_BASE_URL: string = (() => {
  const raw = (import.meta.env.VITE_PUBLIC_API_BASE_URL ?? "").trim();
  if (!raw) return "";
  return raw.replace(/\/+$/, "");
})();

/**
 * Resolve a request input against the public backend base URL.
 * - Absolute URLs (http/https) are returned as-is.
 * - Strings starting with `/` are prefixed with the backend base.
 * - URL objects pass through untouched.
 */
function resolveRequestUrl(input: RequestInfo | URL): RequestInfo | URL {
  if (typeof input !== "string") return input;
  if (/^https?:\/\//i.test(input)) return input;
  if (!PUBLIC_API_BASE_URL) return input;
  if (input.startsWith("/")) return `${PUBLIC_API_BASE_URL}${input}`;
  return input;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(resolveRequestUrl(input), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "error" in payload
        ? String((payload as { error?: unknown }).error)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export function withQuery(path: string, query: Record<string, string | number | boolean | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
