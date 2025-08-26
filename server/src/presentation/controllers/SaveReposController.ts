import { NextFunction, Request, response, Response } from "express";
import { ISearchUseCase } from "../../application/interface/ISearchReposUseCase";
import { AppError } from "../../infrastructure/errors/AppError";
import { ISaveUseCase } from "../../application/interface/ISaveReposUseCase";

export class SaveReposController {
  constructor(private _saveReposUseCase: ISaveUseCase) {}

  save = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repo = req.body;

      if (!repo) {
        throw new AppError("repo is required", 400);
      }

      const repos = await this._saveReposUseCase.execute(repo);

      res.status(200).json({ repos });
    } catch (error: any) {
      console.error("Controller Error:", error);
      next(error);
    }
  };
}
