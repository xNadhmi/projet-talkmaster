import { Router } from 'express';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/users', userRoutes);

router.get('/', (req, res) => {
    res.send('API Root');
});

export default router;