export const errorHandler=(error:unknown):string=>{
    if(error instanceof Error)
    {
        return error.message
    }
    else if(typeof error==='string')
    {
        return error
    }
    else
    {
        return 'an unexpected error occured!'
    }
}