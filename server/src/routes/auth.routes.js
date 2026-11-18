import { Router } from 'express';
import * as auth from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { loginSchema, changePasswordSchema } from '../validators/schemas.js';

const router = Router();

router.post('/login', loginLimiter, validateBody(loginSchema), auth.login);
router.post('/refresh', auth.refresh);
router.post('/logout', auth.logout);
router.get('/me', requireAuth, auth.me);
router.post('/password', requireAuth, validateBody(changePasswordSchema), auth.changePassword);

export default router;
