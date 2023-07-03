import express from "express";
import { deleteUsers, getAllUsers, updateUser } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default ( router: express.Router ) =>
{
    router.get( "/users", isAuthenticated, getAllUsers );
    router.delete( "/users/:id", isAuthenticated, isOwner, deleteUsers );// the order matters
    router.patch( "/users/:id", isAuthenticated, isOwner, updateUser );
};