import { NextFunction, Request, response, Response } from "express";
import { ISearchUseCase } from "../../application/interface/ISearchReposUseCase";
import { AppError } from "../../infrastructure/errors/AppError";

export class SearchReposController {
  constructor(private _searchReposUseCase: ISearchUseCase) {}

  fetch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { keyword, page } = req.query;

      if (!keyword) {
        throw new AppError("Keywork is required", 400);
      }

      const repos = await this._searchReposUseCase.execute(
        keyword as string,
        Number(page)
      );

      res.status(200).json({ repos });
    } catch (error: any) {
      console.error("Controller Error:", error);
      next(error);
    }
  };
}
