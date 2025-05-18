class AllFieldsAreRequiredException extends Error {
    constructor(message = 'All fields are required') {
        super(message);
        this.name = 'AllFieldsAreRequired';
        this.statusCode = 400;
    }
}

module.exports = AllFieldsAreRequiredException;