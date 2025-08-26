import { Repo } from "../../domain/entities/repo";
import { IDbRepository } from "../@types/IDbserRepository";
import { RepoSchema } from "../database/mongodb/schema/repo.schema";
import { AppError } from "../errors/AppError";

export class DbRepository implements IDbRepository {
  async create(data: Repo): Promise<Repo> {
    try {
      const existing = await RepoSchema.findOne({ html_url: data.html_url });
      if (existing) throw new AppError("Repository already saved", 400);
      const newData = RepoSchema.build(data);
      return await newData.save();
    } catch (error: any) {
      throw new AppError(`Failed to create repo: ${error.message}`, 502);
    }
  }

  async fetch(page: number): Promise<{ repos: Repo[]; totalCount: number }> {
    try {
      const limit = 10;
      const skip = (page - 1) * limit;

      const totalCount = await RepoSchema.countDocuments();

      const repos = await RepoSchema.find({})
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalPage = Math.ceil(totalCount / limit);

      return {
        repos,
        totalCount: totalPage,
      };
    } catch (error: any) {
      throw new AppError(`Failed to fetch repos: ${error.message}`, 502);
    }
  }

  async delete(id: string): Promise<Repo> {
    try {
      const deletedData = await RepoSchema.findByIdAndDelete(id);
      if (!deletedData) throw new AppError(`Invalid id `, 400);
      return deletedData;
    } catch (error: any) {
      throw new AppError(`Failed to fetch repos: ${error.message}`, 502);
    }
  }
}
