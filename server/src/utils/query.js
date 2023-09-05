
const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;
function getPagination(query) {
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    //will return a positive num, and if you pass
    // string it a string it will convert that string
    //into a number. 
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const skip = (page-1) * limit;


    return {
        skip: skip,
        limit: limit,
    };
}

module.exports = {
    getPagination,
}