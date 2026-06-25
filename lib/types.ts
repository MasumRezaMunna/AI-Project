export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export type Category =
  | "Adventure"
  | "Culinary"
  | "Cultural"
  | "Wildlife"
  | "Wellness"
  | "Coastal"
  | "Mountain"
  | "City";

export interface Experience {
  id: string;
  title: string;
  category: Category;
  location: string;
  country: string;
  shortDescription: string;
  description: string;
  images: string[];
  price: number;
  currency: "USD";
  rating: number;
  reviewCount: number;
  durationDays: number;
  groupSize: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  highlights: string[];
  includes: string[];
  tags: string[];
  reviews: Review[];
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ExperienceDetailResponse {
  experience: Experience;
  related: Experience[];
}

export type SortOption = "rating-desc" | "price-asc" | "price-desc" | "newest";

export interface ExperienceFilters {
  search: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort: SortOption;
  page: number;
  limit: number;
}

export interface AIRecommendationItem {
  id: string;
  reason: string;
}

export interface AIRecommendResponse {
  summary: string;
  recommendations: AIRecommendationItem[];
}

export interface AIHighlightResponse {
  highlight: string;
}

export type UserRole = "user" | "admin";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
