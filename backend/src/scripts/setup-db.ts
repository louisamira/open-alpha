import dotenv from 'dotenv';
import { createDatabase, initializeSchema, executeSql } from '../services/atxp-db.js';

dotenv.config();

async function setup() {
  console.log('Setting up Open Alpha database...\n');

  try {
    // Step 1: Create database
    console.log('1. Creating SQLite database...');
    const dbPath = await createDatabase();
    console.log('   Database created successfully!');
    console.log(`   Database path: ${dbPath}\n`);

    // Step 2: Initialize schema
    console.log('2. Initializing database schema...');
    await initializeSchema();
    console.log('   Schema created successfully!\n');

    // Step 3: Verify tables (SQLite syntax)
    console.log('3. Verifying tables...');
    const tables = await executeSql<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
    );

    console.log('   Created tables:');
    for (const row of tables.rows) {
      console.log(`   - ${row.name}`);
    }

    console.log('\nDatabase setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run npm run dev to start the server');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setup();
