import type { Repository } from "./Repository";

export interface SearchResponse {
  items?: Repository[];
  repos?:
    | {
        repos?: Repository[];
        totalCount?: number;
      }
    | Repository[];
  total_count?: number;
  totalCount?: number;
}
