import { NextFunction, Request, response, Response } from "express";
import { IFetchUseCase } from "../../application/interface/IFetchReposUseCase";
import { AppError } from "../../infrastructure/errors/AppError";

export class FetchReposController {
  constructor(private _fetchReposUseCase: IFetchUseCase) {}

  fetch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page } = req.query;
      const currentPage = Number(page);

      if (!currentPage) throw new AppError("Page number is required", 400);

      const repos = await this._fetchReposUseCase.execute(currentPage);

      res.status(200).json(repos);
    } catch (error: any) {
      console.error("Controller Error:", error);
      next(error);
    }
  };
}
