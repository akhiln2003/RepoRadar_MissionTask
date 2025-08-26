import mongoose from "mongoose";

interface RepoAttributes {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
}

interface RepoDocument extends mongoose.Document {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RepoModel extends mongoose.Model<RepoDocument> {
  build(attributes: RepoAttributes): RepoDocument;
}

const repoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    html_url: {
      type: String,
      required: true,
      trim: true,
    },
    stargazers_count: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      transform(_: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    timestamps: true,
  }
);

repoSchema.statics.build = (attrs: RepoAttributes) => {
  return new RepoSchema(attrs);
};

const RepoSchema = mongoose.model<RepoDocument, RepoModel>("Repo", repoSchema);

export { RepoSchema };
