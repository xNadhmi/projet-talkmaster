import { Router } from 'express';
import * as slotController from '../controllers/slot.controller.js';
import { authMiddleware, organizerMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', slotController.getAllSlots);

router.get('/:id', slotController.getSlotById);

router.post('/', authMiddleware, organizerMiddleware, slotController.createSlot);

router.put('/:id', authMiddleware, organizerMiddleware, slotController.updateSlot);

router.delete('/:id', authMiddleware, organizerMiddleware, slotController.deleteSlot);

export default router;