import 'dotenv/config';
import { connectDB } from '../lib/database.js';
import { Tenant } from '../lib/models/Tenant.js';
import { User } from '../lib/models/User.js';
import { Note } from '../lib/models/Note.js';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Note.deleteMany({});
    await User.deleteMany({});
    await Tenant.deleteMany({});

    // Create tenants
    console.log('🏢 Creating tenants...');
    const acmeTenant = await Tenant.create({
      name: 'Acme Corporation',
      slug: 'acme',
      plan: 'free',
      noteLimit: 3
    });

    const globexTenant = await Tenant.create({
      name: 'Globex Corporation',
      slug: 'globex',
      plan: 'free',
      noteLimit: 3
    });

    console.log('✅ Tenants created:', {
      acme: acmeTenant.slug,
      globex: globexTenant.slug
    });

    // Create users
    console.log('👥 Creating users...');
    const users = await User.create([
      {
        email: 'admin@acme.test',
        password: 'password',
        role: 'admin',
        tenantId: acmeTenant._id
      },
      {
        email: 'user@acme.test',
        password: 'password',
        role: 'member',
        tenantId: acmeTenant._id
      },
      {
        email: 'admin@globex.test',
        password: 'password',
        role: 'admin',
        tenantId: globexTenant._id
      },
      {
        email: 'user@globex.test',
        password: 'password',
        role: 'member',
        tenantId: globexTenant._id
      }
    ]);

    console.log('✅ Users created:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    // Create sample notes
    console.log('📝 Creating sample notes...');
    const sampleNotes = [
      {
        title: 'Welcome to Acme Notes',
        content: 'This is your first note in the Acme tenant. You can create, edit, and delete notes here.',
        tenantId: acmeTenant._id,
        userId: users.find(u => u.email === 'user@acme.test')._id
      },
      {
        title: 'Getting Started Guide',
        content: 'Here are some tips to get started:\n\n1. Create new notes with the "Create Note" button\n2. Edit notes by clicking the "Edit" button\n3. Delete notes you no longer need\n4. Upgrade to Pro for unlimited notes',
        tenantId: acmeTenant._id,
        userId: users.find(u => u.email === 'admin@acme.test')._id
      },
      {
        title: 'Globex Corporation Welcome',
        content: 'Welcome to Globex Corporation\'s notes system. This is a separate tenant with its own data.',
        tenantId: globexTenant._id,
        userId: users.find(u => u.email === 'user@globex.test')._id
      }
    ];

    await Note.create(sampleNotes);
    console.log('✅ Sample notes created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Accounts (password: password):');
    console.log('  - admin@acme.test (Admin, Acme)');
    console.log('  - user@acme.test (Member, Acme)');
    console.log('  - admin@globex.test (Admin, Globex)');
    console.log('  - user@globex.test (Member, Globex)');

    console.log('\n🔍 Database Summary:');
    console.log(`  - Tenants: ${await Tenant.countDocuments()}`);
    console.log(`  - Users: ${await User.countDocuments()}`);
    console.log(`  - Notes: ${await Note.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Check if script is run directly
if (import.meta.url.endsWith('seed.js')) {
  seedData();
}

export { seedData };
