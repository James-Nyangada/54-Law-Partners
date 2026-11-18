import { Router } from 'express';
import { PracticeArea, Lawyer, Article, Matter, Job } from '../models/index.js';
import { createCrudController } from '../controllers/crudFactory.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  practiceAreaSchema,
  lawyerSchema,
  articleSchema,
  matterSchema,
  jobSchema,
  reorderSchema,
} from '../validators/schemas.js';

/**
 * The five collections that behave the same way. Each is the CRUD factory
 * plus its own config — the differences are declared, not re-implemented.
 */

function mount(router, path, controller, schema, { reorderable = false } = {}) {
  // Reorder is declared before /:id so "reorder" is never read as an id.
  if (reorderable) {
    router.post(`${path}/reorder`, validateBody(reorderSchema), controller.reorder);
  }

  router.get(path, controller.list);
  router.get(`${path}/:id`, controller.get);
  router.post(path, validateBody(schema), controller.create);
  router.patch(`${path}/:id`, validateBody(schema), controller.update);
  router.delete(`${path}/:id`, requireRole('admin'), controller.remove);
}

const router = Router();

router.use(requireAuth);

/* --- practice areas ------------------------------------------------ */
const practiceAreas = createCrudController({
  Model: PracticeArea,
  name: 'practice area',
  searchFields: ['en.title', 'fr.title', 'slug'],
  sortable: ['order', 'createdAt', 'updatedAt'],
  defaultSort: { pillar: 1, order: 1 },
  populate: [{ path: 'lawyers', select: 'slug en.name fr.name portrait' }],
  slugFrom: (body) => body?.en?.title,
});
mount(router, '/practice-areas', practiceAreas, practiceAreaSchema, { reorderable: true });

/* --- lawyers ------------------------------------------------------- */
const lawyers = createCrudController({
  Model: Lawyer,
  name: 'profile',
  searchFields: ['en.name', 'fr.name', 'slug', 'email'],
  sortable: ['order', 'createdAt', 'updatedAt'],
  defaultSort: { order: 1 },
  populate: [{ path: 'practiceAreas', select: 'slug en.title fr.title' }],
  slugFrom: (body) => body?.en?.name,
});
mount(router, '/lawyers', lawyers, lawyerSchema, { reorderable: true });

/* --- articles ------------------------------------------------------ */
const articles = createCrudController({
  Model: Article,
  name: 'article',
  searchFields: ['en.title', 'fr.title', 'slug', 'externalSource'],
  sortable: ['publishedAt', 'createdAt', 'updatedAt'],
  defaultSort: { createdAt: -1 },
  populate: [
    { path: 'practiceArea', select: 'slug en.title fr.title' },
    { path: 'author', select: 'slug en.name fr.name portrait' },
  ],
  slugFrom: (body) => body?.en?.title,
  filters: (req) => {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.practiceArea) filter.practiceArea = req.query.practiceArea;
    if (req.query.author) filter.author = req.query.author;
    return filter;
  },
});
mount(router, '/articles', articles, articleSchema);

/* --- matters ------------------------------------------------------- */
const matters = createCrudController({
  Model: Matter,
  name: 'matter',
  searchFields: ['en.sector', 'en.description', 'fr.sector'],
  sortable: ['order', 'createdAt'],
  defaultSort: { order: 1 },
  populate: [{ path: 'practiceAreas', select: 'slug en.title fr.title' }],
});
mount(router, '/matters', matters, matterSchema, { reorderable: true });

/* --- jobs ---------------------------------------------------------- */
const jobs = createCrudController({
  Model: Job,
  name: 'role',
  searchFields: ['en.title', 'fr.title', 'slug'],
  sortable: ['closingDate', 'createdAt'],
  defaultSort: { createdAt: -1 },
  slugFrom: (body) => body?.en?.title,
});
mount(router, '/jobs', jobs, jobSchema);

export default router;
