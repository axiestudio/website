import * as React from 'react';

interface NewsletterEmailTemplateProps {
  email: string;
  referrer?: string;
}

export function NewsletterEmailTemplate({ 
  email, 
  referrer 
}: NewsletterEmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>📧 New Newsletter Subscription</h1>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>👤 Subscriber Information</h2>
          <p><strong>Email:</strong> {email}</p>
          {referrer && <p><strong>Source:</strong> {referrer}</p>}
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>📊 Subscription Details</h2>
          <p><strong>Newsletter:</strong> AI++ Newsletter</p>
          <p><strong>Focus:</strong> Customer Service Automation & AI Updates</p>
          <p><strong>Status:</strong> Active Subscription</p>
        </div>
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#1976d2' }}>
            🚀 New subscriber joined the AI++ Newsletter from AxieStudio.se
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
            Timestamp: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
