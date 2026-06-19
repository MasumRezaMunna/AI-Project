import axios from "axios";
import {
  AIHighlightResponse,
  AIRecommendResponse,
  ExperienceDetailResponse,
  ExperienceFilters,
  PaginatedResult,
  Experience,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
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
