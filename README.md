


### Exporting notes

```js
//export styles
export foo;
export default foo;
export = foo;

// The three matching import styles
import {foo} from 'blah';
import foo from 'blah';
import * as foo from 'blah';


//compiling result
exports.foo = foo;
exports['default'] = foo;
module.exports = foo;

var foo = require('blah').foo;
var foo = require('blah')['default'];
var foo = require('blah');
```


For importing paths, if the folder has an index.ts, it is not necessary to point to the .ts file, for example:

```js
//if you have a reqTracking function inside middlewares/index.ts, the import can look like
import { reqTracking } from "./middlewares"; 
```

Ps.: using default is not good practice because it causes issues with refactoring and autocomplete features


### Mongoose SQL library

First you create a schema, for example:

```js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema
    ( {
        username: { type: String, required: true },
        email: { type: String, required: true },
        authentication:
        {
            password: { type: String, required: true, select: false },
            salt: { type: String, select: false },
            sessionToken: { type: String, select: false },
        }
    } );

```

Then you create a model based on that schema:

```js

export const UserModel = mongoose.model( "user", UserSchema ); //creates the users table

```

which in POSTGRESQL would be equivalent to:

```sql

CREATE TYPE AUTHENTICATION AS(  -- create composite user-defined type
    password VARCHAR ( 255 ) NOT NULL,
    salt VARCHAR ( 255 ),
    sessionToken VARCHAR ( 255 )
);


CREATE TABLE user(
    _id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 255 ) UNIQUE NOT NULL,
    email VARCHAR ( 255 ) UNIQUE NOT NULL,
    authentication AUTHENTICATION --used here
); 

```

for the mongoose library actions you have: 

#### SELECT

```js
export const getUsers = () => UserModel.find();// SELECT * FROM users;

export const getUserByEmail = ( email: string ) => UserModel.findOne( { email } ); // SELECT * FROM users WHERE email = 'abc@gmail.com';

export const getUserById = ( id: string ) => UserModel.findById( id );// SELECT * FROM users WHERE id = 123456789;

```

#### INSERT

```js

export const createUser = ( values: Record<string, any> ) => new UserModel( values ).save()
    .then( ( user ) => user.toObject() );

//INSERT INTO users (username, email, authentication) VALUES ('abc', 'abc@gmail.com', ('abcABC@3C', 'generated', 'generated') );

```

obs.: salt is generated during implementation, ex:

```js

        const salt = random(); //generates random salt for encryption

        const user = await createUser( {//calls the db query to create user
            email,
            username,
            authentication: {
                salt,
                password: authentication( salt, password ),//see helper functions for details
            }
        } );

```

#### DELETE

```js
export const deleteUserById = ( id: string ) => UserModel.findOneAndDelete( { _id: id } );
//DELETE FROM users WHERE _id = 123456789;
```

#### UPDATE

```js

export const updateUserById = ( id: string, values: Record<string, any> ) => UserModel.findByIdAndUpdate( id, values );
//UPDATE users SET username = 'newusername', authentication.password = 'newpassowrd' WHERE _id = 123456789;

```