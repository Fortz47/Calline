import express from 'express';
import RoomController from "../controller/RoomController";
import Appcontroller from "../controller/AppController";

const router = express.Router();
router.get('/', Appcontroller.homePage);
router.get(['/call/create/:id', '/call/join/:id'], RoomController.openRoom);

export default router;