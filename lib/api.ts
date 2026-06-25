import axios from "axios";
import {
  AIHighlightResponse,
  AIRecommendResponse,
  ExperienceDetailResponse,
  ExperienceFilters,
  PaginatedResult,
  Experience,
  PublicUser,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

// Firebase ID tokens expire hourly and need fresh retrieval (the SDK
// auto-refreshes under the hood), so we ask for one right before each
// request rather than caching a static string. AuthProvider wires this up.
let getTokenFn: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(fn: (() => Promise<string | null>) | null) {
  getTokenFn = fn;
}

apiClient.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    const token = await getTokenFn();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function getExperiences(
  filters: Partial<ExperienceFilters>
): Promise<PaginatedResult<Experience>> {
  const { data } = await apiClient.get<PaginatedResult<Experience>>(
    "/api/experiences",
    { params: filters }
  );
  return data;
}

export async function getExperienceById(
  id: string
): Promise<ExperienceDetailResponse> {
  const { data } = await apiClient.get<ExperienceDetailResponse>(
    `/api/experiences/${id}`
  );
  return data;
}

export async function getCategories(): Promise<string[]> {
  const { data } = await apiClient.get<{ categories: string[] }>(
    "/api/experiences/categories"
  );
  return data.categories;
}

export async function aiRecommend(prompt: string): Promise<AIRecommendResponse> {
  const { data } = await apiClient.post<AIRecommendResponse>("/api/ai/recommend", {
    prompt,
  });
  return data;
}

export async function aiHighlight(
  experienceId: string,
  interest?: string
): Promise<AIHighlightResponse> {
  const { data } = await apiClient.post<AIHighlightResponse>("/api/ai/highlight", {
    experienceId,
    interest,
  });
  return data;
}

/**
 * Called once right after the client creates a Firebase account, to create
 * the matching MongoDB profile (role defaults to "user" server-side).
 */
export async function syncProfile(name?: string): Promise<PublicUser> {
  const { data } = await apiClient.post<{ user: PublicUser }>("/api/auth/register", { name });
  return data.user;
}

/** Fetches the current user's MongoDB profile (auto-created if missing). */
export async function getMe(): Promise<PublicUser> {
  const { data } = await apiClient.get<{ user: PublicUser }>("/api/auth/me");
  return data.user;
}
