import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";

export function reqTracking( req: express.Request, res: express.Response, next: express.NextFunction )
{
    console.log( `${ req.method } request received for ${ req.url } from ${ req.ip }` );
    next();
}

export const isAuthenticated = async ( req: express.Request, res: express.Response, next: express.NextFunction ) =>
{

    try {

        const sessionToken = req.cookies[ 'LARA-AUTH' ];

        if ( !sessionToken ) {
            return res.sendStatus( 403 );
        }

        const existingUser = await getUserBySessionToken( sessionToken );

        if ( !existingUser ) {
            return res.sendStatus( 403 );
        }

        merge( req, { identity: existingUser } );

        next();

    } catch ( error ) {

        console.log( error );
        return res.sendStatus( 400 );
    }

};

export const isOwner = async ( req: express.Request, res: express.Response, next: express.NextFunction ) =>
{
    try {
        const { id } = req.params;
        const currentUserId = get( req, "identity._id" ) as string;

        if ( !currentUserId ||
             currentUserId.toString() !== id ) {

            return res.sendStatus( 403 );
        }


        next();
    } catch ( error ) {
        console.log( error );
        return res.sendStatus( 400 );
    }
};
