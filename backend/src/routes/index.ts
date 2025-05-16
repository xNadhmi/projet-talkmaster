import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';


const router = Router();



router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'UP',
        message: 'API is healthy and running.',
        timestamp: new Date().toISOString(),
    });
});


router.use('/auth', authRoutes); 
router.use('/users', userRoutes); 


router.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Welcome to the TalkMaster API!',
        version: '1.0.0', 
        
    });
});

export default router;
