import e, {Request, Response, NextFunction} from 'express'

export const CatchExpressError = (callFunc:any) => {
    return (req:Request, res:Response, next:NextFunction) => {
        callFunc(req, res, next).catch((err:any)=>{
            res.status(422).json(err)
        });
    };
  };


  


export class ApplicationError extends Error {
    statusCode : number
    status: string
    isOperational: boolean

     constructor(errorMessage:string, code:number){
         super(errorMessage)
         this.statusCode = code
       
         this.status = 'fail'
        
         this.isOperational = true;
         Error.captureStackTrace(this, this.constructor);
         
     }

   

}

