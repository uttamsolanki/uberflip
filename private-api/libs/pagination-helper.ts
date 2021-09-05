export class PaginationHelper {
  static getSkipTake(
    page: number,
    limit: number,
  ): { skip: number; take: number } {
    return { skip: (page - 1) * limit, take: limit };
  }
}
