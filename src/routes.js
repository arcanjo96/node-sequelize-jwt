import { Router } from "express";
import multer from "multer";
import mullterConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileContoller from "./app/controllers/FileController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
const upload = multer(mullterConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.post("/files", upload.single("file"));

export default routes;