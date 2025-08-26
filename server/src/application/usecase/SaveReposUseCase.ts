import { Repo } from "../../domain/entities/repo";
import { IDbRepository } from "../../infrastructure/@types/IDbserRepository";
import { AppError } from "../../infrastructure/errors/AppError";
import { ISaveUseCase } from "../interface/ISaveReposUseCase";

export class SaveUseCase implements ISaveUseCase {
  constructor(private _dbRepo: IDbRepository) {}
  async execute(repo: Repo): Promise<Repo> {
    try {
      return await this._dbRepo.create(repo);
    } catch (error: any) {
      console.error("Error in SaveUseCase:", error);
      throw new AppError("Failed to save repositories", 502);
    }
  }
}
