import { Repo } from "../../domain/entities/repo";

export interface IDeleteUseCase {
  execute(id:string):Promise<Repo>;
}


