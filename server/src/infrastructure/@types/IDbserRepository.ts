import { Repo } from "../../domain/entities/repo";

export interface IDbRepository {
  create(data: Repo): Promise<Repo>;
  fetch(page: number): Promise<{ repos: Repo[]; totalCount: number }>;
  delete(id: string): Promise<Repo>;
}
