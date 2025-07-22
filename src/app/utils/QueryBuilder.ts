import { Query } from "mongoose";
import { excludeFilterFields } from "../Modules/tour/tour.constant";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeFilterFields) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm;

    if (searchTerm) {
      const searchConditions = searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      }));

      this.modelQuery = this.modelQuery.find({ $or: searchConditions });
    }

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build(): Query<T[], T> {
    return this.modelQuery;
  }

  async getMeta(): Promise<{
    page: number;
    limit: number;
    total: number;
    // totalIndex: number;
    totalPage: number;
  }> {
    const totalDocuments = await this.modelQuery.model.countDocuments();

    // Total documents on current page (after pagination)
    // const paginatedDocs = await this.modelQuery;
    // const totalIndex = paginatedDocs.length;

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);

    return {
      // totalIndex,
      page,
      limit,
      total: totalDocuments,
      totalPage,
    };
  }
}
