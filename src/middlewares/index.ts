import express from "express";

export function reqTracking( req: express.Request, res: express.Response, next: express.NextFunction )
{
    console.log( `${ req.method } request received for ${ req.url } from ${ req.ip }` );
    next();
}

