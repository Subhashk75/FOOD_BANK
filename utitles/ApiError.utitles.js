
class ApiError extends Error{
    constructor(
        statusCode,
        message ="something went wrong",
        stack =[]
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
    }
}

export {ApiError}