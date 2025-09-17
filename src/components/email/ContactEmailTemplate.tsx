import * as React from 'react';

interface ContactEmailTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  message: string;
}

export function ContactEmailTemplate({
  firstName,
  lastName,
  email,
  company,
  message,
}: ContactEmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>New Contact Form Submission</h1>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>Contact Details</h2>
          
          <p style={{ margin: '10px 0' }}>
            <strong>Name:</strong> {firstName} {lastName}
          </p>
          
          <p style={{ margin: '10px 0' }}>
            <strong>Email:</strong> {email}
          </p>
          
          {company && (
            <p style={{ margin: '10px 0' }}>
              <strong>Company:</strong> {company}
            </p>
          )}
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px' }}>
          <h2 style={{ color: '#555', marginBottom: '15px' }}>Message</h2>
          <p style={{ lineHeight: '1.6', color: '#666' }}>{message}</p>
        </div>
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#1976d2' }}>
            This email was sent from the AxieStudio website contact form.
          </p>
        </div>
      </div>
    </div>
  );
}
