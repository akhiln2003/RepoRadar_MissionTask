import { Repo } from "../../domain/entities/repo";
import { IDbRepository } from "../../infrastructure/@types/IDbserRepository";
import { AppError } from "../../infrastructure/errors/AppError";
import { IFetchUseCase } from "../interface/IFetchReposUseCase";

export class FetchUseCase implements IFetchUseCase {
  constructor(private _dbRepo: IDbRepository) {}
  async execute(page:number): Promise<{ repos: Repo[]; totalCount: number }> {
    try {
      return await this._dbRepo.fetch(page);
    } catch (error: any) {
      console.error("Error in SearchUseCase:", error);
      throw new AppError("Failed to fetch repositories", 502);
    }
  }
}
