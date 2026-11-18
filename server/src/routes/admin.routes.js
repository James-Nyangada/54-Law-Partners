import { Router } from 'express';
import * as admin from '../controllers/admin.controller.js';
import * as media from '../controllers/media.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { uploadImage, uploadDocument } from '../middleware/upload.js';
import {
  enquiryUpdateSchema,
  applicationUpdateSchema,
  pageSchema,
  settingsSchema,
  userCreateSchema,
  userUpdateSchema,
} from '../validators/schemas.js';

const router = Router();

router.use(requireAuth);

/* --- dashboard ----------------------------------------------------- */
router.get('/summary', admin.summary);

/* --- media --------------------------------------------------------- */
router.get('/media', media.listMedia);
router.post('/media/image', uploadImage.single('file'), media.uploadImageHandler);
router.post('/media/document', uploadDocument.single('file'), media.uploadDocumentHandler);
router.get('/media/:id/signed-url', media.getSignedUrl);
router.patch('/media/:id', media.updateMedia);
router.delete('/media/:id', requireRole('admin'), media.deleteMedia);

/* --- enquiries ----------------------------------------------------- */
router.get('/enquiries', admin.listEnquiries);
router.get('/enquiries/:id', admin.getEnquiry);
router.patch('/enquiries/:id', validateBody(enquiryUpdateSchema), admin.updateEnquiry);
router.delete('/enquiries/:id', requireRole('admin'), admin.deleteEnquiry);

/* --- applications -------------------------------------------------- */
router.get('/applications', admin.listApplications);
router.get('/applications/:id', admin.getApplication);
router.get('/applications/:id/cv', admin.getApplicationCv);
router.patch('/applications/:id', validateBody(applicationUpdateSchema), admin.updateApplication);
router.delete('/applications/:id', requireRole('admin'), admin.deleteApplication);

/* --- pages --------------------------------------------------------- */
router.get('/pages', admin.listPages);
router.get('/pages/:key', admin.getPageByKey);
router.put('/pages/:key', validateBody(pageSchema), admin.updatePage);

/* --- settings ------------------------------------------------------ */
router.get('/settings', admin.getSettings);
router.put('/settings', requireRole('admin'), validateBody(settingsSchema), admin.updateSettings);

/* --- subscribers --------------------------------------------------- */
router.get('/subscribers', admin.listSubscribers);
router.delete('/subscribers/:id', requireRole('admin'), admin.deleteSubscriber);

/* --- audit --------------------------------------------------------- */
router.get('/audit', requireRole('admin'), admin.listAudit);

/* --- users --------------------------------------------------------- */
router.get('/users', requireRole('admin'), admin.listUsers);
router.post('/users', requireRole('admin'), validateBody(userCreateSchema), admin.createUser);
router.patch('/users/:id', requireRole('admin'), validateBody(userUpdateSchema), admin.updateUser);
router.delete('/users/:id', requireRole('admin'), admin.deleteUser);

export default router;
