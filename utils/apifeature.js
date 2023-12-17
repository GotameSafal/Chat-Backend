export class Apifeature {
  constructor(queryStr, query) {
    this.queryStr = queryStr;
    this.query = query;
  }
  search() {
    let keyword = this.queryStr.keyword
      ? {
          username: {
            $regex: this.queryStr.keyword,
            $option: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  pagination() {
    let page = Number(this.queryStr.page) || 1;
    let limit = Number(this.queryStr.limit) || 10;
    this.query = this.query.limit(limit * page);
    return this;
  }
}
