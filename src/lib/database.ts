import fs from 'fs/promises';
import path from 'path';

// Define data types
export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  usecase: string;
  timeline?: string;
  referrer?: string;
  timestamp: string;
  status: 'pending' | 'contacted' | 'completed';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  referrer?: string;
  timestamp: string;
  status: 'active' | 'unsubscribed';
}

// Database file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const CONSULTATIONS_FILE = path.join(DATA_DIR, 'consultations.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic file operations
async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Consultation functions
export async function saveConsultationRequest(request: Omit<ConsultationRequest, 'id' | 'timestamp' | 'status'>): Promise<ConsultationRequest> {
  const consultations = await readJsonFile<ConsultationRequest>(CONSULTATIONS_FILE);
  
  const newRequest: ConsultationRequest = {
    ...request,
    id: generateId(),
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  
  consultations.push(newRequest);
  await writeJsonFile(CONSULTATIONS_FILE, consultations);
  
  return newRequest;
}

export async function getConsultationRequests(): Promise<ConsultationRequest[]> {
  return readJsonFile<ConsultationRequest>(CONSULTATIONS_FILE);
}

export async function updateConsultationStatus(id: string, status: ConsultationRequest['status']): Promise<boolean> {
  const consultations = await readJsonFile<ConsultationRequest>(CONSULTATIONS_FILE);
  const index = consultations.findIndex(c => c.id === id);
  
  if (index === -1) return false;
  
  consultations[index].status = status;
  await writeJsonFile(CONSULTATIONS_FILE, consultations);
  
  return true;
}

// Newsletter functions
export async function saveNewsletterSubscriber(subscriber: Omit<NewsletterSubscriber, 'id' | 'timestamp' | 'status'>): Promise<NewsletterSubscriber> {
  const subscribers = await readJsonFile<NewsletterSubscriber>(SUBSCRIBERS_FILE);
  
  // Check if email already exists
  const existingSubscriber = subscribers.find(s => s.email === subscriber.email);
  if (existingSubscriber) {
    // Reactivate if previously unsubscribed
    if (existingSubscriber.status === 'unsubscribed') {
      existingSubscriber.status = 'active';
      existingSubscriber.timestamp = new Date().toISOString();
      await writeJsonFile(SUBSCRIBERS_FILE, subscribers);
    }
    return existingSubscriber;
  }
  
  const newSubscriber: NewsletterSubscriber = {
    ...subscriber,
    id: generateId(),
    timestamp: new Date().toISOString(),
    status: 'active',
  };
  
  subscribers.push(newSubscriber);
  await writeJsonFile(SUBSCRIBERS_FILE, subscribers);
  
  return newSubscriber;
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  return readJsonFile<NewsletterSubscriber>(SUBSCRIBERS_FILE);
}

export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  const subscribers = await readJsonFile<NewsletterSubscriber>(SUBSCRIBERS_FILE);
  const index = subscribers.findIndex(s => s.email === email);
  
  if (index === -1) return false;
  
  subscribers[index].status = 'unsubscribed';
  await writeJsonFile(SUBSCRIBERS_FILE, subscribers);
  
  return true;
}

// Utility functions
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Analytics functions
export async function getAnalytics() {
  const consultations = await getConsultationRequests();
  const subscribers = await getNewsletterSubscribers();
  
  return {
    consultations: {
      total: consultations.length,
      pending: consultations.filter(c => c.status === 'pending').length,
      contacted: consultations.filter(c => c.status === 'contacted').length,
      completed: consultations.filter(c => c.status === 'completed').length,
    },
    newsletter: {
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    },
  };
}
