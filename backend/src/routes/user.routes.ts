import express from 'express';
import { userController } from '../controllers/index.js'; 

const router = express.Router();


router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);

export default router;