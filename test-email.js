// Test script to verify email functionality
const testConsultation = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        company: 'Test Company',
        phone: '+1-555-0123',
        usecase: 'Testing email functionality for AxieStudio',
        timeline: 'ASAP'
      })
    });

    const data = await response.json();
    console.log('Consultation Response:', response.status, data);
  } catch (error) {
    console.error('Consultation Error:', error);
  }
};

const testNewsletter = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'newsletter-test@example.com'
      })
    });

    const data = await response.json();
    console.log('Newsletter Response:', response.status, data);
  } catch (error) {
    console.error('Newsletter Error:', error);
  }
};

// Run tests
console.log('Testing AxieStudio Email System...');
testConsultation();
setTimeout(() => testNewsletter(), 2000);
