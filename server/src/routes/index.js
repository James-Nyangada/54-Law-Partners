import { Router } from 'express';
import publicRoutes from './public.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import contentRoutes from './content.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, at: new Date().toISOString() });
});

router.use('/public', publicRoutes);
router.use('/admin/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/admin', contentRoutes);

export default router;
