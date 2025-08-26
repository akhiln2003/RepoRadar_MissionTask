export interface Repository {
  _id?: string | number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count?: number;
  watchers_count?: number;
  language?: string | null;
  savedAt?: string;
  created_at?: string;
  updated_at?: string;
}
