const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Create a connection pool to Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrateData() {
  console.log('🚀 Starting migration to Neon PostgreSQL...');
  
  const client = await pool.connect();
  
  try {
    // Initialize database tables
    console.log('📋 Creating database tables...');
    
    // Create consultations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        phone VARCHAR(50),
        usecase TEXT NOT NULL,
        timeline VARCHAR(100),
        referrer VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(20) DEFAULT 'medium',
        notes TEXT,
        follow_up_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create newsletter subscribers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        referrer VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create desktop downloads table
    await client.query(`
      CREATE TABLE IF NOT EXISTS desktop_downloads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        operating_system VARCHAR(50) NOT NULL,
        language VARCHAR(50) NOT NULL,
        use_case TEXT,
        subscribe_newsletter BOOLEAN DEFAULT false,
        download_link TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'sent',
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created successfully');

    // Migrate consultations
    const consultationsFile = path.join(__dirname, '../data/consultations.json');
    if (fs.existsSync(consultationsFile)) {
      console.log('📊 Migrating consultations...');
      const consultationsData = JSON.parse(fs.readFileSync(consultationsFile, 'utf8'));
      
      for (const consultation of consultationsData) {
        try {
          await client.query(`
            INSERT INTO consultations (
              name, email, company, phone, usecase, timeline, referrer, 
              status, priority, notes, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT DO NOTHING
          `, [
            consultation.name,
            consultation.email,
            consultation.company,
            consultation.phone,
            consultation.usecase || consultation.useCase,
            consultation.timeline,
            consultation.referrer,
            consultation.status || 'pending',
            consultation.priority || 'medium',
            consultation.notes || null,
            consultation.timestamp || new Date().toISOString()
          ]);
        } catch (err) {
          console.warn(`⚠️  Skipping duplicate consultation: ${consultation.email}`);
        }
      }
      console.log(`✅ Migrated ${consultationsData.length} consultations`);
    }

    // Migrate newsletter subscribers
    const subscribersFile = path.join(__dirname, '../data/subscribers.json');
    if (fs.existsSync(subscribersFile)) {
      console.log('📧 Migrating newsletter subscribers...');
      const subscribersData = JSON.parse(fs.readFileSync(subscribersFile, 'utf8'));
      
      for (const subscriber of subscribersData) {
        try {
          await client.query(`
            INSERT INTO newsletter_subscribers (email, referrer, status, created_at)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
          `, [
            subscriber.email,
            subscriber.referrer,
            subscriber.status || 'active',
            subscriber.timestamp || new Date().toISOString()
          ]);
        } catch (err) {
          console.warn(`⚠️  Skipping duplicate subscriber: ${subscriber.email}`);
        }
      }
      console.log(`✅ Migrated ${subscribersData.length} newsletter subscribers`);
    }

    // Migrate desktop downloads
    const downloadsFile = path.join(__dirname, '../data/desktop-downloads.json');
    if (fs.existsSync(downloadsFile)) {
      console.log('💻 Migrating desktop downloads...');
      const downloadsData = JSON.parse(fs.readFileSync(downloadsFile, 'utf8'));
      
      for (const download of downloadsData) {
        try {
          await client.query(`
            INSERT INTO desktop_downloads (
              name, email, company, operating_system, language, use_case,
              subscribe_newsletter, download_link, status, ip_address, user_agent, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `, [
            download.name,
            download.email,
            download.company,
            download.operatingSystem,
            download.language,
            download.useCase,
            download.subscribeNewsletter || false,
            download.downloadLink,
            download.status || 'sent',
            download.ipAddress || null,
            download.userAgent || null,
            download.timestamp || new Date().toISOString()
          ]);
        } catch (err) {
          console.warn(`⚠️  Error migrating download for ${download.email}:`, err.message);
        }
      }
      console.log(`✅ Migrated ${downloadsData.length} desktop downloads`);
    }

    // Verify migration
    console.log('🔍 Verifying migration...');
    
    const consultationCount = await client.query('SELECT COUNT(*) FROM consultations');
    const subscriberCount = await client.query('SELECT COUNT(*) FROM newsletter_subscribers');
    const downloadCount = await client.query('SELECT COUNT(*) FROM desktop_downloads');
    
    console.log(`📊 Migration Summary:`);
    console.log(`   • Consultations: ${consultationCount.rows[0].count}`);
    console.log(`   • Newsletter Subscribers: ${subscriberCount.rows[0].count}`);
    console.log(`   • Desktop Downloads: ${downloadCount.rows[0].count}`);
    
    console.log('🎉 Migration completed successfully!');
    console.log('🔥 Your AxieStudio admin dashboard is now powered by Neon PostgreSQL!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrateData().catch(console.error);
