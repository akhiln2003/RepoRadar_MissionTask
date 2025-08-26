import { NextFunction, Request, response, Response } from "express";
import { AppError } from "../../infrastructure/errors/AppError";
import { IDeleteUseCase } from "../../application/interface/IDeleteReposUseCase";

export class DeleteReposController {
  constructor(private _deleteReposUseCase: IDeleteUseCase) {}

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError("Id is required", 400);
      }

      const repos = await this._deleteReposUseCase.execute(id as string);

      res.status(200).json({ repos });
    } catch (error: any) {
      console.error("Controller Error:", error);
      next(error);
    }
  };
}
