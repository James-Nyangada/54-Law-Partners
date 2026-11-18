import { Router } from 'express';
import * as pub from '../controllers/public.controller.js';
import { validateBody } from '../middleware/validate.js';
import { publicWriteLimiter } from '../middleware/rateLimit.js';
import { uploadDocument } from '../middleware/upload.js';
import { publicEnquirySchema, publicSubscribeSchema } from '../validators/schemas.js';

/**
 * Read-only content plus the three public write endpoints. No authentication,
 * so every write here is rate limited and validated.
 */
const router = Router();

router.get('/practice-areas', pub.listPracticeAreas);
router.get('/practice-areas/:slug', pub.getPracticeArea);

router.get('/lawyers', pub.listLawyers);
router.get('/lawyers/:slug', pub.getLawyer);

router.get('/articles', pub.listArticles);
router.get('/articles/:slug', pub.getArticle);

router.get('/matters', pub.listMatters);

router.get('/jobs', pub.listJobs);
router.get('/jobs/:slug', pub.getJob);

router.get('/pages/:key', pub.getPage);
router.get('/settings', pub.getSettings);

router.post('/enquiries', publicWriteLimiter, validateBody(publicEnquirySchema), pub.createEnquiry);
router.post('/applications', publicWriteLimiter, uploadDocument.single('cv'), pub.createApplication);
router.post('/subscribers', publicWriteLimiter, validateBody(publicSubscribeSchema), pub.subscribe);
router.get('/subscribers/confirm/:token', pub.confirmSubscription);
router.get('/subscribers/unsubscribe/:token', pub.unsubscribe);

export default router;
