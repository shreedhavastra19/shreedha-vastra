// ================================================================
// Shreedha Vastra — API Features (Filter / Search / Sort / Paginate)
// ================================================================
// Wraps a Mongoose query and chains filtering, search, sorting,
// field-limiting, and pagination based on query string params.
// Used mainly by productController's getProducts endpoint.
//
// Example usage:
//   const features = new APIFeatures(Product.find(), req.query)
//     .filter()
//     .search()
//     .sort()
//     .paginate();
//   const products = await features.query;
// ================================================================

class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query object
    this.queryString = queryString; // req.query
  }

  // ---- Filtering: ?category=xyz&price[gte]=500&price[lte]=2000&size=M&color=Peach ----
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'keyword'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert gte/gt/lte/lt to Mongo operators: price[gte]=500 -> { price: { $gte: 500 } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsed = JSON.parse(queryStr);

    // Support filtering by size/color which live in nested arrays
    if (parsed.size) {
      parsed['sizes.size'] = parsed.size;
      delete parsed.size;
    }
    if (parsed.color) {
      parsed['colors.name'] = parsed.color;
      delete parsed.color;
    }

    this.query = this.query.find(parsed);
    return this;
  }

  // ---- Text search: ?search=peach silk suit ----
  search() {
    const term = this.queryString.search || this.queryString.keyword;
    if (term) {
      this.query = this.query.find({ $text: { $search: term } });
    }
    return this;
  }

  // ---- Sorting: ?sort=price or ?sort=-price,-createdAt ----
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // newest first by default
    }
    return this;
  }

  // ---- Field limiting: ?fields=name,price,images ----
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // ---- Pagination: ?page=2&limit=12 ----
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
