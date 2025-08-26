import { Repo } from "../../domain/entities/repo";

export interface IFetchUseCase {
  execute(page: number): Promise<{ repos: Repo[]; totalCount: number }>;
}
