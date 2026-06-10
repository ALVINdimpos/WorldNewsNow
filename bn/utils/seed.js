require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const JournalistProfile = require('../models/JournalistProfile');
const Article = require('../models/Article');
const { SAMPLE_ARTICLES } = require('./seedArticles');

const JOURNALISTS = [
  { name: 'Elena Vasquez', email: 'elena.vasquez@primeworld.news', specialty: 'World Affairs', bio: 'Former foreign correspondent covering conflict zones across the Middle East and Sahel.' },
  { name: 'James Okonkwo', email: 'james.okonkwo@primeworld.news', specialty: 'Technology', bio: 'Investigative reporter focused on AI regulation, platform accountability, and digital rights.' },
  { name: 'Sarah Chen', email: 'sarah.chen@primeworld.news', specialty: 'Business & Markets', bio: 'Economics editor with fifteen years covering global trade, energy markets, and central banking.' },
  { name: 'Marcus Reid', email: 'marcus.reid@primeworld.news', specialty: 'Science & Climate', bio: 'Science correspondent reporting on climate policy, public health, and space exploration.' },
  { name: 'Amira Hassan', email: 'amira.hassan@primeworld.news', specialty: 'Sports', bio: 'Sports editor covering international football, athletics governance, and athlete welfare.' },
  { name: 'David Park', email: 'david.park@primeworld.news', specialty: 'Entertainment & Culture', bio: 'Culture critic examining film, streaming economics, and the politics of global entertainment.' },
];

const SEED_PASSWORD = 'SeedJournalist2026!';

async function upsertJournalist({ name, email, specialty, bio }) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      password: SEED_PASSWORD,
      role: 'journalist',
      emailVerified: true,
      bio,
    });
  } else if (user.role !== 'journalist') {
    user.role = 'journalist';
    user.bio = bio;
    await user.save();
  }

  let profile = await JournalistProfile.findOne({ user: user._id });
  if (!profile) {
    profile = await JournalistProfile.create({
      user: user._id,
      specialty,
      bio,
      isVerified: true,
    });
  }

  return user;
}

async function seed() {
  await connectDB();
  console.log('Connected to MongoDB');

  const authors = [];
  for (const j of JOURNALISTS) {
    const user = await upsertJournalist(j);
    authors.push(user);
    console.log(`  Journalist ready: ${user.name}`);
  }

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < SAMPLE_ARTICLES.length; i += 1) {
    const data = SAMPLE_ARTICLES[i];
    const existing = await Article.findOne({ title: data.title });
    if (existing) {
      skipped += 1;
      continue;
    }

    const author = authors[i % authors.length];
    const daysAgo = i + 1;
    const publishedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    await Article.create({
      ...data,
      author: author._id,
      isDraft: false,
      isPublished: true,
      publishedAt,
      featured: i === 0,
      breaking: i === 2,
      viewCount: Math.floor(Math.random() * 4000) + 200,
      guestLikes: Math.floor(Math.random() * 80) + 5,
      totalLikes: Math.floor(Math.random() * 80) + 5,
    });
    created += 1;
    console.log(`  Created: ${data.title.slice(0, 60)}…`);
  }

  const total = await Article.countDocuments({ isPublished: true, isDraft: false });
  console.log(`\nDone — ${created} created, ${skipped} skipped (already exist), ${total} published total.`);
  console.log(`Journalist login: any *@primeworld.news email / ${SEED_PASSWORD}\n`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
