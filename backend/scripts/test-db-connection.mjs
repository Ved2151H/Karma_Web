import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Set DATABASE_URL in your environment or .env file.');
  process.exit(1);
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();
  console.log('CONNECTED OK\n');

  const info = await client.query(
    'SELECT version(), current_database() AS database, current_user AS user'
  );
  console.log('Database info:');
  console.log(JSON.stringify(info.rows[0], null, 2));
  console.log();

  const tables = await client.query(`
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY 1, 2
  `);

  console.log(`Tables (${tables.rowCount}):`);
  if (tables.rowCount === 0) {
    console.log('  (none yet)');
  } else {
    for (const row of tables.rows) {
      console.log(`  - ${row.table_schema}.${row.table_name}`);
    }
  }
} catch (error) {
  console.error('CONNECTION FAILED:', error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
