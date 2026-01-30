import dotenv from 'dotenv';
import { createDatabase, initializeSchema, executeSql } from '../services/atxp-db.js';

dotenv.config();

async function setup() {
  console.log('Setting up Open Alpha database...\n');

  try {
    // Step 1: Create database
    console.log('1. Creating database via ATXP Database MCP...');
    const dbUrl = await createDatabase();
    console.log('   Database created successfully!');
    console.log(`   Connection URL: ${dbUrl.substring(0, 50)}...\n`);

    // Step 2: Initialize schema
    console.log('2. Initializing database schema...');
    await initializeSchema();
    console.log('   Schema created successfully!\n');

    // Step 3: Verify tables
    console.log('3. Verifying tables...');
    const tables = await executeSql<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public'
       ORDER BY table_name`
    );

    console.log('   Created tables:');
    for (const row of tables.rows) {
      console.log(`   - ${row.table_name}`);
    }

    console.log('\nDatabase setup complete!');
    console.log('\nNext steps:');
    console.log('1. Save your database URL to .env');
    console.log('2. Run npm run dev to start the server');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setup();
