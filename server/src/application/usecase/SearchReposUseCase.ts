import { Repo } from "../../domain/entities/repo";
import { AppError } from "../../infrastructure/errors/AppError";
import { fetchRepos } from "../../infrastructure/external-services/githubApi";
import { ISearchUseCase } from "../interface/ISearchReposUseCase";

export class SearchUseCase implements ISearchUseCase {

  async execute(
    keyword: string,
    page = 1
  ): Promise<{ repos: Repo[]; totalCount: number }> {
    try {
      const { repos, totalCount } = await fetchRepos(keyword, page);

      return { repos, totalCount };
    } catch (error: any) {
      console.error("Error in SearchUseCase:", error);
      throw new AppError("Failed to fetch repositories", 502);
    }
  }
}
