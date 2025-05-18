class AppointmentConflictException extends Error {
    constructor(message = 'The appointment slot isnt available at that time.') {
        super(message);
        this.name = 'AppointmentConflictError';
        this.statusCode = 409;
    }
}

module.exports = AppointmentConflictException;