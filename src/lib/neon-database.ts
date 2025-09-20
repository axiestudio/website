import { Pool } from 'pg';

// Create a connection pool to Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Database initialization - create tables if they don't exist
export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
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

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Consultation functions
export async function saveConsultationRequest(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  usecase: string;
  timeline?: string;
  referrer?: string;
}) {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      INSERT INTO consultations (name, email, company, phone, usecase, timeline, referrer)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [data.name, data.email, data.company, data.phone, data.usecase, data.timeline, data.referrer]);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error saving consultation:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getConsultationRequests() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        id,
        name,
        email,
        company,
        phone,
        usecase,
        timeline,
        referrer,
        status,
        priority,
        notes,
        follow_up_date as "followUpDate",
        created_at as timestamp,
        updated_at as "updatedAt"
      FROM consultations 
      ORDER BY created_at DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error getting consultations:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateConsultationStatus(
  id: number,
  updates: {
    status?: string;
    priority?: string;
    notes?: string;
    followUpDate?: string;
  }
) {
  const client = await pool.connect();
  
  try {
    const setParts = [];
    const values = [];
    let paramCount = 1;

    if (updates.status !== undefined) {
      setParts.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }
    if (updates.priority !== undefined) {
      setParts.push(`priority = $${paramCount++}`);
      values.push(updates.priority);
    }
    if (updates.notes !== undefined) {
      setParts.push(`notes = $${paramCount++}`);
      values.push(updates.notes);
    }
    if (updates.followUpDate !== undefined) {
      setParts.push(`follow_up_date = $${paramCount++}`);
      values.push(updates.followUpDate || null);
    }

    setParts.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE consultations 
      SET ${setParts.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating consultation:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Newsletter functions
export async function saveNewsletterSubscriber(data: {
  email: string;
  referrer?: string;
}) {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      INSERT INTO newsletter_subscribers (email, referrer)
      VALUES ($1, $2)
      ON CONFLICT (email) 
      DO UPDATE SET 
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [data.email, data.referrer]);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error saving newsletter subscriber:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getNewsletterSubscribers() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        id,
        email,
        referrer,
        status,
        created_at as timestamp,
        updated_at as "updatedAt"
      FROM newsletter_subscribers 
      ORDER BY created_at DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error getting newsletter subscribers:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Desktop downloads functions
export async function addDesktopDownloadRequest(data: {
  name: string;
  email: string;
  company?: string;
  operatingSystem: string;
  language: string;
  useCase?: string;
  subscribeNewsletter: boolean;
  downloadLink: string;
  status: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      INSERT INTO desktop_downloads (
        name, email, company, operating_system, language, use_case,
        subscribe_newsletter, download_link, status, ip_address, user_agent
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      data.name, data.email, data.company, data.operatingSystem, data.language,
      data.useCase, data.subscribeNewsletter, data.downloadLink, data.status,
      data.ipAddress, data.userAgent
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error saving desktop download:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getDesktopDownloadRequests() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        id,
        name,
        email,
        company,
        operating_system as "operatingSystem",
        language,
        use_case as "useCase",
        subscribe_newsletter as "subscribeNewsletter",
        download_link as "downloadLink",
        status,
        ip_address as "ipAddress",
        user_agent as "userAgent",
        created_at as timestamp
      FROM desktop_downloads 
      ORDER BY created_at DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error getting desktop downloads:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Analytics function
export async function getAnalytics() {
  const client = await pool.connect();
  
  try {
    // Get consultation stats
    const consultationStats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'contacted') as contacted,
        COUNT(*) FILTER (WHERE status = 'qualified') as qualified,
        COUNT(*) FILTER (WHERE status = 'proposal_sent') as proposal_sent,
        COUNT(*) FILTER (WHERE status = 'closed_won') as closed_won,
        COUNT(*) FILTER (WHERE status = 'closed_lost') as closed_lost,
        COUNT(*) FILTER (WHERE status = 'follow_up') as follow_up,
        COUNT(*) FILTER (WHERE priority = 'high') as high_priority,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as this_week
      FROM consultations
    `);

    // Get newsletter stats
    const newsletterStats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed
      FROM newsletter_subscribers
    `);

    // Get desktop download stats
    const desktopStats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'sent') as sent,
        COUNT(*) FILTER (WHERE status = 'downloaded') as downloaded,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) FILTER (WHERE operating_system = 'windows') as windows,
        COUNT(*) FILTER (WHERE operating_system = 'macos') as macos,
        COUNT(*) FILTER (WHERE operating_system = 'linux') as linux,
        COUNT(*) FILTER (WHERE language = 'english') as english,
        COUNT(*) FILTER (WHERE language = 'swedish') as swedish
      FROM desktop_downloads
    `);

    // Get recent data
    const consultationsList = await getConsultationRequests();
    const subscribersList = await getNewsletterSubscribers();
    const desktopDownloadsList = await getDesktopDownloadRequests();

    return {
      consultations: {
        total: parseInt(consultationStats.rows[0].total),
        pending: parseInt(consultationStats.rows[0].pending),
        contacted: parseInt(consultationStats.rows[0].contacted),
        qualified: parseInt(consultationStats.rows[0].qualified),
        proposalSent: parseInt(consultationStats.rows[0].proposal_sent),
        closedWon: parseInt(consultationStats.rows[0].closed_won),
        closedLost: parseInt(consultationStats.rows[0].closed_lost),
        followUp: parseInt(consultationStats.rows[0].follow_up),
        highPriority: parseInt(consultationStats.rows[0].high_priority),
        thisWeek: parseInt(consultationStats.rows[0].this_week)
      },
      newsletter: {
        total: parseInt(newsletterStats.rows[0].total),
        active: parseInt(newsletterStats.rows[0].active),
        unsubscribed: parseInt(newsletterStats.rows[0].unsubscribed)
      },
      desktopDownloads: {
        total: parseInt(desktopStats.rows[0].total),
        sent: parseInt(desktopStats.rows[0].sent),
        downloaded: parseInt(desktopStats.rows[0].downloaded),
        failed: parseInt(desktopStats.rows[0].failed),
        byOS: {
          windows: parseInt(desktopStats.rows[0].windows),
          macos: parseInt(desktopStats.rows[0].macos),
          linux: parseInt(desktopStats.rows[0].linux)
        },
        byLanguage: {
          english: parseInt(desktopStats.rows[0].english),
          swedish: parseInt(desktopStats.rows[0].swedish)
        }
      },
      consultationsList: consultationsList.slice(0, 50),
      subscribersList: subscribersList.slice(0, 50),
      desktopDownloadsList: desktopDownloadsList.slice(0, 50)
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Close pool connection
export async function closePool() {
  await pool.end();
}
