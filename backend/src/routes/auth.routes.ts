import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { authMiddleware, organizerMiddleware} from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/me', authMiddleware, authController.me)
router.get('/:id', authMiddleware, organizerMiddleware, authController.getUserById)

export default router