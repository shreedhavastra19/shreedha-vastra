// ================================================================
// Shreedha Vastra — Database Seeder
// ================================================================
// Run with: npm run seed
// Creates the first admin account (from .env credentials) and a
// starter set of categories, if they don't already exist. Safe to
// run multiple times — it won't create duplicates.
// ================================================================
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

dotenv.config();

const starterCategories = [
  { name: 'Suit Sets', description: 'Elegant traditional suit sets', isFeatured: true, displayOrder: 1 },
  { name: 'Kurta Sets', description: 'Comfortable everyday and festive kurta sets', isFeatured: true, displayOrder: 2 },
  { name: 'Festive Collection', description: 'Vibrant outfits for every festival', isFeatured: true, displayOrder: 3 },
  { name: 'Wedding Collection', description: 'Bridal and wedding-guest ethnic wear', isFeatured: true, displayOrder: 4 },
  { name: 'Raja Rani Collection', description: 'Royal couple-coordinated ethnic sets', isFeatured: true, displayOrder: 5 },
];

const seed = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin creation.');
    } else {
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (existingAdmin) {
        console.log(`Admin account already exists: ${adminEmail}`);
      } else {
        await User.create({
          name: 'Shreedha Vastra Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          isEmailVerified: true,
        });
        console.log(`Admin account created: ${adminEmail}`);
      }
    }

    for (const cat of starterCategories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`Category created: ${cat.name}`);
      }
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seed();