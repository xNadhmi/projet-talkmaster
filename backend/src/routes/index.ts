import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

router.use('/users', userRoutes);

router.get('/', (req, res) => {
    res.send('API Root');
});

export default router;