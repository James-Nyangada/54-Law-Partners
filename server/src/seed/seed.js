import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { env } from '../config/env.js';
import { User, PracticeArea, Page, Setting } from '../models/index.js';
import { toSlug } from '../utils/slug.js';
import { PAGE_KEYS } from '../models/Page.js';

/**
 * Seeds the first administrator, the eight practice areas agreed with the
 * firm, and empty shells for the standing pages.
 *
 * Content is left blank on purpose. The firm supplies every word that appears
 * on the site; nothing here invents a description of what the practice does.
 *
 *   npm run seed          add anything missing, leave existing data alone
 *   npm run seed:reset    delete the seeded collections first
 */

const PRACTICE_AREAS = [
  { pillar: 'transactions', order: 1, title: 'Corporate, Commercial & Governance' },
  { pillar: 'transactions', order: 2, title: 'Banking, Finance & Investment' },
  { pillar: 'transactions', order: 3, title: 'Mergers, Acquisitions & Private Equity' },
  { pillar: 'transactions', order: 4, title: 'Projects, Infrastructure & Energy' },
  { pillar: 'transactions', order: 5, title: 'International Trade, Investment & Regulatory Advisory' },
  { pillar: 'disputes', order: 6, title: 'Litigation, Arbitration & Alternative Dispute Resolution' },
  { pillar: 'disputes', order: 7, title: 'Investigations' },
  {
    pillar: 'international',
    order: 8,
    title: 'Public International Law, Human Rights & Regional / International Dispute Settlement',
  },
];

const reset = process.argv.includes('--reset');

async function seedAdmin() {
  const { name, email, password } = env.seedAdmin;

  if (!email || !password) {
    console.log('[seed] no SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD set, skipping the admin user');
    return;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`[seed] admin already exists: ${existing.email}`);
    return;
  }

  const user = new User({
    name: name || 'Administrator',
    email: email.toLowerCase(),
    role: 'admin',
  });
  await user.setPassword(password);
  await user.save();

  console.log(`[seed] created admin: ${user.email}`);
  console.log('[seed] sign in, change this password, then clear it from .env');
}

async function seedPracticeAreas() {
  for (const area of PRACTICE_AREAS) {
    const slug = toSlug(area.title);
    const existing = await PracticeArea.findOne({ slug });

    if (existing) {
      console.log(`[seed] practice area exists: ${slug}`);
      continue;
    }

    await PracticeArea.create({
      slug,
      pillar: area.pillar,
      order: area.order,
      status: 'draft', // nothing goes live until the firm supplies the copy
      en: { title: area.title },
      fr: {},
    });

    console.log(`[seed] created practice area: ${slug}`);
  }
}

async function seedPages() {
  for (const key of PAGE_KEYS) {
    const existing = await Page.findOne({ key });
    if (existing) continue;
    await Page.create({ key, status: 'draft' });
    console.log(`[seed] created page shell: ${key}`);
  }
}

async function seedSettings() {
  await Setting.load();
  console.log('[seed] settings ready');
}

async function run() {
  await connectDatabase();

  if (reset) {
    console.log('[seed] --reset: clearing practice areas, pages and settings');
    await Promise.all([
      PracticeArea.deleteMany({}),
      Page.deleteMany({}),
      Setting.deleteMany({}),
    ]);
  }

  await seedAdmin();
  await seedPracticeAreas();
  await seedPages();
  await seedSettings();

  console.log('[seed] done');
  await disconnectDatabase();
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('[seed] failed:', error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
