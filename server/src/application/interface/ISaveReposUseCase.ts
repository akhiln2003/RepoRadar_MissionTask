import { Repo } from "../../domain/entities/repo";

export interface ISaveUseCase {
  execute(repo:Repo):Promise<Repo>;
}


