import express from "express";
import authentication from "./authentication";
import users from "./users";

const router = express.Router();

export default (): express.Router => //when you use the default keyword, on the import it is no necessary to use { }
{
    authentication( router );
    users( router );
    return router;
}


