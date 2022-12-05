

export class ResponseHandlers {
    modelQuery: any
    model: any

    constructor(model:any, modelQuery:any) {
        this.model = model;
        this.modelQuery = modelQuery;
      }
    
      filter() {
        const query = { ...this.modelQuery }
        const fieldsToRemove = ['page', 'sort', 'limit', 'fields'];
        fieldsToRemove.forEach(el => delete query[el]);
    
        
        let queryStr = JSON.stringify(query);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
        this.model = this.model.find(JSON.parse(queryStr));
    
        return this;
      }
    
      sort() {
        
        if (this.modelQuery.sort) {
          const sortBy = this.modelQuery.sort.split(',').join(' ');
          this.model = this.model.sort(sortBy);
        } else {
          this.model = this.model.sort('-time');
        }
    
        return this;
      }
    
      limitFields() {
        if (this.modelQuery.fields) {
          const fields = this.modelQuery.fields.split(',').join(' ');
          this.model = this.model.select(fields);
        } else {
          this.model = this.model.select('-__v');
        }
    
        return this;
      }
    
      paginate() {
        const page = this.modelQuery.page * 1 || 1;
        const limit = this.modelQuery.limit * 1 || 100;
        const skip = (page - 1) * limit;
    
        this.model = this.model.skip(skip).limit(limit);
    
        return this;
      }
}
