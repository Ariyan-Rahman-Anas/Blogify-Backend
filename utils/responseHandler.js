//success handler
export const successHandler = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    })
}

//error handler
export const errorHandler = (res, message, error = {}, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error
    })
}