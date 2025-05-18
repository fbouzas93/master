class MaxRetriesExceededException extends Error {
    constructor(message = 'Could not complete the booking due to high concurrency.') {
        super(message);
        this.name = 'MaxRetriesExceeded';
        this.statusCode = 400;
    }
}

module.exports = MaxRetriesExceededException;