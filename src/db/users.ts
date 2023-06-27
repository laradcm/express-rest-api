import mongoose from "mongoose";

//-------------Schema------------------------------------------------

const UserSchema = new mongoose.Schema
    ( {
        username: { type: String, required: true },
        email: { type: String, required: true },
        authentication:
        {
            password: { type: String, required: true, select: false }, //select set to false to prevent authentication data leak
            salt: { type: String, select: false },//additional input to hash data
            sessionToken: { type: String, select: false },
        }
    } );

export const UserModel = mongoose.model( "user", UserSchema );


//-------------Actions------------------------------------------------//REFACTOR put in another file

//-------------Read

export const getUsers = () => UserModel.find();

export const getUserByEmail = ( email: string ) => UserModel.findOne( { email } );

export const getUserBySessionToken = ( sessionToken: string ) => UserModel.findOne
    ( {
        "authentication.sessionToken": sessionToken
    } );

export const getUserById = ( id: string ) => UserModel.findById( id );



//-------------Create

export const createUser = ( values: Record<string, any> ) => new UserModel( values ).save()
    .then( ( user ) => user.toObject() );



//-------------Delete

export const deleteUserById = ( id: string ) => UserModel.findOneAndDelete( { _id: id } );



//-------------Update

export const updateUserById = ( id: string, values: Record<string, any> ) => UserModel.findByIdAndUpdate( id, values );
