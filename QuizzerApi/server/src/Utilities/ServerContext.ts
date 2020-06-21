import {
  Request,
  Response,
} from 'express';

export interface ServerContext{
   req : Request;
   res: Response;
   payload? : {userid : string , publisher: boolean} 
}