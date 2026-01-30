import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MCP_URL = 'https://database.mcp.atxp.ai/mcp';

let client: Client | null = null;
let databaseUrl: string | null = null;

interface ExecuteSqlResult {
  rows: Record<string, unknown>[];
  rowCount: number;
}

interface CreateDatabaseResult {
  connectionString: string;
}

async function getClient(): Promise<Client> {
  if (client) return client;

  const connectionString = process.env.ATXP_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('ATXP_CONNECTION_STRING environment variable is required');
  }

  client = new Client({
    name: 'open-alpha-backend',
    version: '0.1.0',
  });

  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${connectionString}`,
      },
    },
  });

  await client.connect(transport);
  return client;
}

export async function createDatabase(): Promise<string> {
  const mcpClient = await getClient();

  const result = await mcpClient.callTool({
    name: 'database_create_database',
    arguments: {},
  });

  const content = result.content as Array<{ type: string; text?: string }>;
  const textContent = content.find(c => c.type === 'text');
  if (!textContent?.text) {
    throw new Error('Failed to create database');
  }

  const parsed = JSON.parse(textContent.text) as CreateDatabaseResult;
  databaseUrl = parsed.connectionString;
  return databaseUrl;
}

export async function getDatabaseUrl(): Promise<string> {
  if (databaseUrl) return databaseUrl;

  // Try to create a new database if we don't have one
  return createDatabase();
}

export async function executeSql<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  const mcpClient = await getClient();
  const dbUrl = await getDatabaseUrl();

  // Replace $1, $2, etc. with actual values for simple cases
  // Note: For production, use proper parameterized queries
  let processedSql = sql;
  if (params) {
    params.forEach((param, index) => {
      const placeholder = `$${index + 1}`;
      const value = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : String(param);
      processedSql = processedSql.replace(placeholder, value);
    });
  }

  const result = await mcpClient.callTool({
    name: 'database_execute_sql',
    arguments: {
      database_url: dbUrl,
      sql: processedSql,
    },
  });

  const content = result.content as Array<{ type: string; text?: string }>;
  const textContent = content.find(c => c.type === 'text');
  if (!textContent?.text) {
    return { rows: [], rowCount: 0 };
  }

  const parsed = JSON.parse(textContent.text) as ExecuteSqlResult;
  return {
    rows: parsed.rows as T[],
    rowCount: parsed.rowCount,
  };
}

export async function initializeSchema(): Promise<void> {
  const schema = `
    -- Users (students and parents)
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      role TEXT NOT NULL CHECK (role IN ('student', 'parent')),
      grade_level INT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Parent-child links
    CREATE TABLE IF NOT EXISTS parent_links (
      id SERIAL PRIMARY KEY,
      parent_id INT REFERENCES users(id),
      student_id INT REFERENCES users(id),
      invite_code TEXT UNIQUE,
      linked_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Progress tracking
    CREATE TABLE IF NOT EXISTS progress (
      id SERIAL PRIMARY KEY,
      student_id INT REFERENCES users(id),
      subject TEXT NOT NULL,
      concept_id TEXT NOT NULL,
      mastery_score INT DEFAULT 0,
      attempts INT DEFAULT 0,
      last_attempt_at TIMESTAMP,
      completed_at TIMESTAMP,
      UNIQUE(student_id, subject, concept_id)
    );

    -- Chat sessions (tutor and coach)
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      session_type TEXT CHECK (session_type IN ('tutor', 'coach')),
      subject TEXT,
      concept_id TEXT,
      messages JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  await executeSql(schema);
}

export default {
  createDatabase,
  getDatabaseUrl,
  executeSql,
  initializeSchema,
};
