import { Repo } from "../../domain/entities/repo";
import { IDbRepository } from "../../infrastructure/@types/IDbserRepository";
import { AppError } from "../../infrastructure/errors/AppError";
import { IDeleteUseCase } from "../interface/IDeleteReposUseCase";

export class DeleteUseCase implements IDeleteUseCase {
  constructor(private _dbRepo: IDbRepository) {}
  async execute(id: string): Promise<Repo> {
    try {
      return await this._dbRepo.delete(id);
    } catch (error: any) {
      console.error("Error in DeleteUseCase:", error);
      throw new AppError("Failed to delete repositories", 502);
    }
  }
}
