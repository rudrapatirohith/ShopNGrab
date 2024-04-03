class APIFilters{
    constructor(query,queryStr){ // query is expected to be a Mongoose query object that will be used to filter the products. queryStr is an object containing the query string parameters from the request.
        this.query=query;
        this.queryStr=queryStr;
    }
    search(){ // responsible for applying the keyword filter to the query.
        const keyword = this.queryStr.keyword ? { // if keyword present in the queryStr object will go to next step if not we will go to line 13
            name :{     // searching name of the keyword
                $regex : this.queryStr.keyword, // used to search in the realted name of the product no need of exact match with the product name of the keyword like if we search disk we get sandisk details
                $options : "i" // using this itll make case insensitive so small or captial letters all be treated same
            },
        }
         : {}; //  if keyword not presnt itll be empty object

        this.query=this.query.find({...keyword}) // This filter is then applied to the query object using the find method.If no keyword is provided, it simply returns the original query without applying any filters.
        return this
    }


    filters(){
        
        const queryCopy = {...this.queryStr}; // queries we gave earlier
        
        // Fields to remove
        const feildsToRemove = ['keyword','page'] //create array  --- we create page in pagination but here in this we get oage details so we cant work on pagination due to that so we remove it formhere
        feildsToRemove.forEach((e)=>delete queryCopy[e]) // remove that keyword
         
        // Advanced Filters for price , ratings etc

        let queryStr = JSON.stringify(queryCopy); // converting the queryCopy to string
        // after converting     //  \b used to match entire word   /g used for global search  
        // replaces occurrences of 'gt', 'gte', 'lt', or 'lte' in queryStr with their dollar-sign prefixed versions
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr)) //find the requested one with exact match it finds the parse queries and filters op accordingly
        return this //returns that
    }

    pagination(resPerPage){

        const currentPage = Number(this.queryStr.page) || 1; //checks for the page number from the req and if there is nmbr it will take that or else itll take as 1 and shows first page
        const skip = resPerPage * (currentPage-1); // if i gave page 2 now itll work like (4*(2-1)=>4) so from page 5-8 will be shown
// console.log(this.queryStr);
        this.query = this.query.limit(resPerPage).skip(skip); //skip will skip over calculated no of docs and limit used to give limited no of docs as per our specified nmbrof results per page ex: we gave 4 
        return this
    }
}

export default APIFilters;