import { Router } from 'express';
import * as talkController from '../controllers/talk.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', talkController.getAllTalks);

router.get('/:id', talkController.getTalkById);

router.post('/', authMiddleware, talkController.createTalk);

router.put('/:id', authMiddleware, talkController.updateTalk);

router.delete('/:id', authMiddleware, talkController.deleteTalk);


export default router;