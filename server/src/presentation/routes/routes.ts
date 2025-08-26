import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { SearchReposController } from "../controllers/SearchReposController";
import { SaveReposController } from "../controllers/SaveReposController";
import { FetchReposController } from "../controllers/fetchReposController";
import { DeleteReposController } from "../controllers/DeleteRepoController";
// import { DIContainer } from "../../infrastructure/di/DIContainer";

export class Routers {
  private _router: Router;
  private _diContainer: DIContainer;

  private _searchReposController!: SearchReposController;
  private _saveReposController!: SaveReposController;
  private _fetchReposController!: FetchReposController;
  private _deleteReposController!: DeleteReposController

  constructor() {
    this._router = Router();
    this._diContainer = new DIContainer();
    this._initializeControllers();
    this._initializeRoutes();
  }

  private _initializeControllers(): void {
    this._searchReposController = new SearchReposController(
      this._diContainer.searchUseCase()
    );

    this._saveReposController = new SaveReposController(
      this._diContainer.saveUseCase()
    );
     this._deleteReposController = new DeleteReposController(
      this._diContainer.deleteUseCase()
    );
    this._fetchReposController = new FetchReposController(
      this._diContainer.fetchUseCase()
    );
  }

  private _initializeRoutes(): void {
    this._router.get("/search", this._searchReposController.fetch);

    this._router.post("/saved-repos", this._saveReposController.save);
    this._router.delete("/delete-repo/:id", this._deleteReposController.delete);
    this._router.get("/fetch-repo", this._fetchReposController.fetch);
  }

  public getRouter(): Router {
    return this._router;
  }
}
