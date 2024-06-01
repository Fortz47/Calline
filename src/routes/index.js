import express from 'express';
// import cors from "cors";
import RoomController from "../controller/RoomController";
import Appcontroller from "../controller/AppController";

const router = express.Router();
// const corsOption = {
//   origin: ['http://192.168.43.109', 'http://localhost'],
//   optionsSuccessStatus: 200,
// };
router.get('/', Appcontroller.homePage);
router.get(['/call/create/:id', '/call/join/:id'], RoomController.openRoom);

export default router;