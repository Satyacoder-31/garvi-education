const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.zhkexnxgvtlvmogksfej:DrOrthosSecure2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function test() {
  const settings = await pool.query('SELECT * FROM garvi_settings WHERE id = 1');
  console.log('Settings title:', settings.rows[0]?.workshop_title);

  const reg = await pool.query(`
    INSERT INTO garvi_registrations (
      registration_id, full_name, mobile, email, school_name, city, role, amount, status
    ) VALUES (
      'TEST-REG-001', 'Test Principal', '9999999999', 'test@school.com', 'Test School', 'Rewa', 'Principal', 199, 'registration_confirmed'
    ) RETURNING *;
  `);
  console.log('Inserted:', reg.rows[0]?.registration_id);

  const list = await pool.query('SELECT * FROM garvi_registrations');
  console.log('Total count:', list.rowCount);

  await pool.query("DELETE FROM garvi_registrations WHERE registration_id = 'TEST-REG-001'");
  console.log('Cleaned up test row successfully');
  await pool.end();
}

test().catch(e => { console.error('Test error:', e); pool.end(); });
