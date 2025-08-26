import { Repo } from "../../domain/entities/repo";

export interface ISearchUseCase {
  execute(keyword: string , page:number):Promise<{ repos: Repo[]; totalCount: number }>;
}


