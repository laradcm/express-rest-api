import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();


//base 64 so it is digestible for our database VARCHAR type
export const random = () => crypto.randomBytes( 128 ).toString( "base64" );

export const authentication = ( salt: string, password: string ) =>
{
    return crypto
        .createHmac( "sha256", [ salt, password ].join( "/" ) )
        .update( process.env.SECRET )
        .digest( "hex" );
};

//the authentication function when populated with:
// (salt, password) - creates the user encrypted password
// (salt, id.toString()) - generates the user session when logging in





