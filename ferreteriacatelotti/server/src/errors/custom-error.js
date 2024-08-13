export default class CustomError {
    static createError({ name = "Error", cause = "unknown", message, code = 1 }) {
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = code;
        return error; // Cambié `throw error;` por `return error;`
    }
}

