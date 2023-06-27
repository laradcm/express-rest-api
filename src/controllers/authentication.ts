import express from "express";

import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";


//------------Login------------------------------
export const login = async ( req: express.Request, res: express.Response ) =>
{
    try {

        const { email, password } = req.body;

        if ( !email || !password ) {
            return res.sendStatus( 400 );//REFACTOR improve message
        }

        const user = await getUserByEmail( email ).select( '+authentication.salt +authentication.password' );//query projection, to access authentication and salt 

        if ( !user ) {
            return res.sendStatus( 400 );//REFACTOR improve message
        }

        const expectedHash = authentication( user.authentication.salt, password );

        if ( user.authentication.password != expectedHash ) {
            return res.sendStatus( 403 );//REFACTOR improve message
        }

        const salt = random();
        user.authentication.sessionToken = authentication( salt, user._id.toString() ); //that's how the session is created 

        await user.save();

        //setting the cookie
        res.cookie( 'LARA-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' } );

        return res.status( 200 ).json( user ).end();//REFACTOR review this return for sensitive info

    } catch ( error ) {
        console.log( error );
        return res.sendStatus( 400 );//REFACTOR improve message
    }
};


//------------Register----------------------------
export const register = async ( req: express.Request, res: express.Response ) =>
{
    try {

        console.log( req.body );//TEMP
        const { email, password, username } = req.body;

        if ( !email || !password || !username ) {
            return res.sendStatus( 400 );//REFACTOR improve message
        }

        const existingUser = await getUserByEmail( email );// call the db query to find user by email

        if ( existingUser ) {//because this is a register function we dont want duplicates
            return res.sendStatus( 400 );//REFACTOR improve message
        }

        const salt = random(); //generates random salt for encryption

        const user = await createUser( {//calls the db query to create user
            email,
            username,
            authentication: {
                salt,
                password: authentication( salt, password ),
            }
        } );

        return res.status( 200 ).json( user ).end();//if we got here then we are gucci, returns the user

    } catch ( error ) {
        console.log( error );
        return res.sendStatus( 400 );//REFACTOR improve message
    }
};