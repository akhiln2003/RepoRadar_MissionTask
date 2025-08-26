import { IDeleteUseCase } from "../../application/interface/IDeleteReposUseCase";
import { IFetchUseCase } from "../../application/interface/IFetchReposUseCase";
import { ISaveUseCase } from "../../application/interface/ISaveReposUseCase";
import { ISearchUseCase } from "../../application/interface/ISearchReposUseCase";
import { DeleteUseCase } from "../../application/usecase/DeleteReposUseCase";
import { FetchUseCase } from "../../application/usecase/FetchReposUseCase";
import { SaveUseCase } from "../../application/usecase/SaveReposUseCase";
import { SearchUseCase } from "../../application/usecase/SearchReposUseCase";
import { IDbRepository } from "../@types/IDbserRepository";
import { DbRepository } from "../repositories/dbRepository";


export class DIContainer {
  private _dbRepository: IDbRepository;
  

  constructor() {
    this._dbRepository = new DbRepository();
    
  }

  searchUseCase():ISearchUseCase {
    return new SearchUseCase();
  }

  saveUseCase():ISaveUseCase {
    return new SaveUseCase(this._dbRepository);
  }
    deleteUseCase():IDeleteUseCase {
    return new DeleteUseCase(this._dbRepository);
  }



    fetchUseCase():IFetchUseCase {
    return new FetchUseCase(this._dbRepository);
  }

}