import axios from "axios";
import { Repo } from "../../domain/entities/repo";
import { AppError } from "../errors/AppError";

export async function fetchRepos(
  keyword: string,
  page: number = 1,
  perPage: number = 10
): Promise<{ repos: Repo[]; totalCount: number }> {
  const url = process.env.GITHUB_URL;
  if (!url) throw new AppError("Faild to get github url ", 500);

  const res = await axios.get(url, {
    params: {
      q: keyword,
      per_page: perPage,
      page: page,
    },
  });

  return {
    repos: res.data.items.map((repo: any) => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
    })),
    totalCount: res.data.total_count,
  };
}
