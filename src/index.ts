import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router";
import { reqTracking } from "./middlewares";
const PORT: number = +process.env.PORT || 3000;
const HOST: string = process.env.HOST || "127.0.0.1";
const app = express();

dotenv.config();

//middlewares
app.use(
    cors( {
        //allows for other ips to access this server
        credentials: true,
    } )
);

app.use( compression() );
app.use( cookieParser() );
app.use( express.json() );  //body parser
app.use( reqTracking );     //custom function that logs requests

//routes (Always after middlewares or else it will not work)
app.use( "/", router() );

//Listen
app.listen( PORT, HOST, () =>
{
    console.log( "Listening on port: " + PORT );
} );

//db connection
mongoose.Promise = Promise;
mongoose.connect( process.env.MONGO_URL );
mongoose.connection.on( "error", ( error: Error ) =>
{
    console.log( "error" );
} );
